import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import * as utils from "../../utils";

@Component({ computed: mapState(["characters"]) })
export default class OverviewPage extends Vue {
  calculateLevel(stars: number): number {
    return utils.starsToLevel(stars).level;
  }
}
