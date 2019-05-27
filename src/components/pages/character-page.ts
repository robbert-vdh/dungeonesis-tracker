import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import { Character } from "../../store";
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
}
