import Vue from "vue";
import Component from "vue-class-component";
import { mapGetters, mapState } from "vuex";

import ChangelogModal from "./modals/changelog-modal.vue";
import CharacterAddModal from "./modals/character-add-modal.vue";

@Component({
  components: {
    "changelog-modal": ChangelogModal,
    "character-add-modal": CharacterAddModal
  },
  computed: {
    ...mapState(["activeRequests"]),
    ...mapGetters({ showChangelog: "isNewVersion" })
  }
})
export default class Router extends Vue {
  activeRequests!: number;

  /**
   * Whether we have finished initializing our data.
   */
  hasLoaded = false;

  async created() {
    await Promise.all([
      this.$store.dispatch("fetchCharacters"),
      this.$store.dispatch("fetchUserInfo")
    ]);

    this.hasLoaded = true;
  }
}
