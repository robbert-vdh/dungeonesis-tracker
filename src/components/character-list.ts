import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { mapGetters, mapState } from "vuex";

import * as utils from "../utils";
import { Character, UserInfo } from "../store";

@Component({
  computed: {
    ...mapState(["user"]),
    ...mapGetters({ characters: "sortedCharacters" })
  }
})
export default class CharacterList extends Vue {
  /**
   * The active character is not part of the menu. This way we can use the
   * character list inside of a dropdown.
   */
  @Prop(Number) readonly activeId: number | undefined;
  characters!: Character[];
  user!: UserInfo;

  /**
   * Retrieve a list of sorted characters excluding the currently selected
   * character (if any). This is used when the character list is used as a
   * dropdown with the currently selected character at the top.
   */
  get charactersWithoutActive(): Character[] {
    const activeId = this.activeId;
    if (activeId === undefined) {
      return this.characters;
    } else {
      return this.characters.filter(character => character.id != activeId);
    }
  }

  formatProgress(character: Character): string {
    const progress = utils.starsToLevel(character.stars);
    const level = utils.formatLevel(progress.level);
    if (character.dead) {
      return `lvl ${level} (dead)`;
    }

    if (progress.level >= 20) {
      return `lvl ${level} + ${progress.banners}b`;
    }

    const nextLevelProgression = utils.nextLevelProgress(progress) * 100;
    return `lvl ${level} + ${nextLevelProgression.toFixed(1)}%`;
  }
}
