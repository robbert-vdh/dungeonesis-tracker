import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";
import * as _ from "lodash";

// Any error messages received while sending requests to the API are shown using
// toasts. For this we use an axios interceptor defined in index.ts.

Vue.use(Vuex);

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

/**
 * Parameters for POST requests to `/api/user/adjust/`.
 */
export interface AdjustRequest {
  stars: number;
  reason?: string;
}

/**
 * Parameters for POST requests to `/api/characters/<id>/spend/`. The id here is
 * part of this object.
 */
export interface StarSpendRequest {
  id: number;
  stars: number;
}

/**
 * A character as returned by the REST API. This will be transformed into the
 * Character definition below.
 */
export interface Character {
  id: number;
  name: string;
  stars: number;
  dead: boolean;
  reason?: string;
}

/**
 * A single entry in a player's log.
 */
export type LogEntry = {
  id: number;
  character: number;
  created_at: string;
} & (
  | {
      type: "LogType.STARS_SPENT";
      value: { amount: number; reason: string };
    }
  | {
      type: "LogType.STARS_ADDED";
      value: { stars: number; reason: string };
    }
  | {
      type: "LogType.CHARACTER_ADDED";
      value: Character;
    }
  | {
      type: "LogType.CHARACTER_DELETED";
      value: Character;
    });

export interface UserInfo {
  first_name: string;
  last_name: string;
  unspent_stars: number;
}

export var store = new Vuex.Store({
  state: {
    activeRequests: <number>0,
    characters: <{ [id: number]: Character }>{},
    lastVersion: window.localStorage.getItem("last-version") || CURRENT_VERSION,
    logs: <LogEntry[]>[],
    user: <UserInfo | null>null
  },
  getters: {
    // Returns true the first time the application loads for a new version. This
    // is solely used to show the changelog once whenever a new version gets
    // released.
    isNewVersion: state => {
      const isNewVersion = state.lastVersion != CURRENT_VERSION;
      window.localStorage.setItem("last-version", CURRENT_VERSION);

      return isNewVersion;
    },
    sortedCharacters: state => _.orderBy(state.characters, ["stars"], ["desc"])
  },
  mutations: {
    addCharacter(state, character: Character) {
      Vue.set(state.characters, character.id, character);
    },
    adjustCharacterStars(state, updatedCharacter: Character) {
      state.characters[updatedCharacter.id].stars += updatedCharacter.stars;
    },
    adjustStars(state, delta: number) {
      // This mutation should only be callable after the user's initial
      // information has been loaded
      if (state.user !== null) {
        state.user.unspent_stars += delta;
      }
    },
    deleteCharacter(state, id: number) {
      Vue.delete(state.characters, id);
    },
    finishRequest(state) {
      state.activeRequests -= 1;
    },
    initUserInfo(state, info: UserInfo) {
      state.user = info;
    },
    renameCharacter(state, renamedCharacter: Character) {
      state.characters[renamedCharacter.id].name = renamedCharacter.name;
    },
    setDeathStatus(state, updatedCharacter: Character) {
      state.characters[updatedCharacter.id].dead = updatedCharacter.dead;
    },
    setLogs(state, logs: LogEntry[]) {
      state.logs = logs;
    },
    startRequest(state) {
      state.activeRequests += 1;
    }
  },
  actions: {
    async adjustStars({ commit }, params: AdjustRequest) {
      await axios.post("/api/user/adjust/", params);

      commit("adjustStars", params.stars);
    },
    async createCharacter({ commit }, character: Character) {
      const response = await axios.post("/api/characters/", character);

      // The server generates the new character's ID for us
      commit("addCharacter", response.data);
    },
    async deleteCharacter({ commit }, id: number) {
      await axios.delete(`/api/characters/${id}/`);

      commit("deleteCharacter", id);
    },
    async fetchCharacters({ commit }) {
      const response = await axios.get("/api/characters/");

      for (const character of response.data) {
        commit("addCharacter", character);
      }
    },
    async fetchUserInfo({ commit }) {
      const response = await axios.get("/api/user/");

      commit("initUserInfo", response.data);
    },
    async fetchLogs({ commit }) {
      const response = await axios.get("/api/user/logs/");

      commit("setLogs", response.data);
    },
    async renameCharacter({ commit }, renamedCharacter: Character) {
      await axios.patch(`/api/characters/${renamedCharacter.id}/`, {
        name: renamedCharacter.name
      });

      commit("renameCharacter", renamedCharacter);
    },
    // This modifies the character directly without using the star pool, see
    // `exptracker/api/character.py` for more information
    async setCharacterStars({ commit, state }, updatedCharacter: Character) {
      const oldStars = state.characters[updatedCharacter.id].stars;
      await axios.patch(`/api/characters/${updatedCharacter.id}/`, {
        stars: updatedCharacter.stars,
        reason: updatedCharacter.reason
      });

      commit("adjustCharacterStars", {
        id: updatedCharacter.id,
        stars: updatedCharacter.stars - oldStars
      });
    },
    async setDeathStatus({ commit }, updatedCharacter: Character) {
      await axios.patch(`/api/characters/${updatedCharacter.id}/`, {
        dead: updatedCharacter.dead
      });

      commit("setDeathStatus", updatedCharacter);
    },
    async spendStars({ commit }, params: StarSpendRequest) {
      await axios.post(`/api/characters/${params.id}/spend/`, params);

      commit("adjustStars", -params.stars);
      commit("adjustCharacterStars", params);
    }
  }
});
