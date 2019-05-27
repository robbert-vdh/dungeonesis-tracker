import Vue from "vue";
import Component from "vue-class-component";

import CharacterList from "../character-list.vue";
import HeaderBar from "../header-bar.vue";

@Component({
  components: { "character-list": CharacterList, "header-bar": HeaderBar }
})
export default class OverviewPage extends Vue {}
