import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export interface Character {
  name: string,
  stars: number
}

/**
 * A character as returned by the REST API. This will be transformed into the
 * Character definition above.
 */
export interface ApiCharacter {
  id: number,
  name: string,
  stars: number
}

export var store = new Vuex.Store({
  state: {
    characters: <{ [id: number]: Character }>{}
  },
  mutations: {
    addCharacter(state, character: ApiCharacter) {
      Vue.set(state.characters, character.id, {
        name: character.name,
        stars: character.stars
      });
    }
  },
  actions: {
    async fetchCharacters({ commit }) {
      const response = await axios.get('/api/characters/');
      const characters = response.data;

      for (const character of characters) {
        commit('addCharacter', character);
      }
    }
  }
});
