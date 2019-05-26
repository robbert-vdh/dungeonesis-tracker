import Vue from "vue";
import { mapState } from "vuex";
import Component from "vue-class-component";

@Component({ computed: mapState(["user"]) })
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
