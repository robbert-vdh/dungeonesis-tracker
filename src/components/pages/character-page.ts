import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import { Character } from "../../store";
import * as utils from "../../utils";
import CharacterList from "../character-list.vue";
import HeaderBar from "../header-bar.vue";
import CharacterDeleteModal from "../modals/character-delete-modal.vue";
import CharacterRenameModal from "../modals/character-rename-modal.vue";

// TypeScript does not allow decorators to add properties, so we need to somehow
// work around this
interface Shim {
  characterId: number;
}

@Component({
  components: {
    "character-list": CharacterList,
    "header-bar": HeaderBar,
    "character-delete-modal": CharacterDeleteModal,
    "character-rename-modal": CharacterRenameModal
  },
  props: {
    characterId: Number
  },
  computed: mapState(["user"])
})
export default class CharacterPage extends Vue {
  get character(): Character {
    return this.$store.state.characters[(<Shim>(<any>this)).characterId];
  }

  get level(): number {
    return this.progress.level;
  }

  /**
   * A fraction between 0 and 1 to indacte how far the character has progressed
   * to the next level. Will always be 1 if the character is level 20 or above.
   */
  get nextLevelProgress(): number {
    if (this.level >= 20) {
      return 1.0;
    } else {
      return utils.nextLevelProgress(this.progress);
    }
  }

  get progress(): utils.CharacterProgression {
    return utils.starsToLevel(this.character.stars);
  }
}
