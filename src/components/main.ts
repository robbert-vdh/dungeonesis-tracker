import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import CharacterAddModal from "./modals/character-add-modal.vue";

@Component({
  components: { "character-add-modal": CharacterAddModal },
  computed: mapState(["user"])
})
export default class Router extends Vue {
  /** Whether we have finished initializing our data. */
  hasLoaded = false;

  async created() {
    await Promise.all([
      this.$store.dispatch("fetchCharacters"),
      this.$store.dispatch("fetchUserInfo")
    ]);

    this.hasLoaded = true;
  }
}
