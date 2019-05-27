import Vue from "vue";
import Component from "vue-class-component";
import { mapGetters, mapState } from "vuex";

import * as utils from "../utils";

@Component({
  computed: {
    ...mapState(["user"]),
    ...mapGetters({ characters: "sortedCharacters" })
  }
})
export default class CharacterList extends Vue {
  formatProgress(stars: number): string {
    const character = utils.starsToLevel(stars);
    if (character.level >= 20) {
      return `lvl ${character.level} + ${character.banners}b`;
    }

    const progression = utils.nextLeveLprogress(character) * 100;
    return `lvl ${character.level} + ${progression}%`;
  }
}
