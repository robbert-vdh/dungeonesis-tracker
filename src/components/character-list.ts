import Vue from "vue";
import Component from "vue-class-component";
import { mapGetters, mapState } from "vuex";

import * as utils from "../utils";
import { Character } from "../store";

interface Shim {
  characters: Character[];
  activeId: number | undefined;
}

@Component({
  computed: {
    ...mapState(["user"]),
    ...mapGetters({ characters: "sortedCharacters" })
  },
  props: {
    // The active character is not part of the menu. This way we can use the
    // character list inside of a dropdown.
    activeId: {
      type: Number,
      required: false
    }
  }
})
export default class CharacterList extends Vue {
  /**
   * Retrieve a list of sorted characters excluding the currently selected
   * character (if any). This is used when the character list is used as a
   * dropdown with the currently selected character at the top.
   */
  get charactersWithoutActive(): Character[] {
    const activeId = (<Shim>(<any>this)).activeId;
    if (activeId === undefined) {
      return (<Shim>(<any>this)).characters;
    } else {
      return (<Shim>(<any>this)).characters.filter(
        character => character.id != activeId
      );
    }
  }

  formatProgress(stars: number): string {
    const character = utils.starsToLevel(stars);
    if (character.level >= 20) {
      return `lvl ${character.level} + ${character.banners}b`;
    }

    const progression = utils.nextLeveLprogress(character) * 100;
    return `lvl ${character.level} + ${progression}%`;
  }
}
