import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import { Character } from "../../store";
import CharacterList from "../character-list.vue";
import HeaderBar from "../header-bar.vue";
import CharacterRenameModal from "../modals/character-rename-modal.vue";

// TypeScript does not allow decorators to add properties, so we need to somehow
// work around this
interface Shim {
  id: number;
}

@Component({
  components: {
    "character-list": CharacterList,
    "header-bar": HeaderBar,
    "character-rename-modal": CharacterRenameModal
  },
  props: {
    id: Number
  },
  computed: mapState(["user"])
})
export default class CharacterPage extends Vue {
  get character(): Character {
    return this.$store.state.characters[(<Shim>(<any>this)).id];
  }
}
