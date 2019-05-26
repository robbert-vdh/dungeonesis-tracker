import Vue from "vue";
import Component from "vue-class-component";

@Component({})
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
