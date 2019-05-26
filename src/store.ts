import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";
import * as _ from "lodash";

Vue.use(Vuex);

/**
 * A character as returned by the REST API. This will be transformed into the
 * Character definition below.
 */
export interface ApiCharacter {
  id: number;
  name: string;
  stars: number;
}

export interface Character {
  name: string;
  stars: number;
}

export interface UserInfo {
  first_name: string;
  last_name: string;
  unspent_stars: number;
}

export var store = new Vuex.Store({
  state: {
    characters: <{ [id: number]: Character }>{},
    user: <UserInfo | null>null
  },
  getters: {
    sortedCharacters: state => _.orderBy(state.characters, ["stars"], ["desc"])
  },
  mutations: {
    addCharacter(state, character: ApiCharacter) {
      Vue.set(state.characters, character.id, {
        name: character.name,
        stars: character.stars
      });
    },
    adjustStars(state, delta: number) {
      // This mutation should only be callable after the user's initial
      // information has been loaded
      if (state.user !== null) {
        state.user.unspent_stars += delta;
      }
    },
    initUserInfo(state, info: UserInfo) {
      state.user = info;
    }
  },
  actions: {
    async fetchCharacters({ commit }) {
      const response = await axios.get("/api/characters/");

      for (const character of response.data) {
        commit("addCharacter", character);
      }
    },
    async fetchUserInfo({ commit }) {
      const response = await axios.get("/api/user/");

      commit("initUserInfo", response.data);
    }
  }
});
