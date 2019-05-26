import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import * as utils from "../../utils";

(<any>Window).utils = utils;

@Component({ computed: mapState(["characters"]) })
export default class OverviewPage extends Vue {
  calculateProgress(stars: number): string {
    const character = utils.starsToLevel(stars);
    if (character.level >= 20) {
      return `lvl ${character.level} + ${character.banners}b`;
    }

    const progression = utils.nextLeveLprogress(character) * 100;
    return `lvl ${character.level} (${progression}%)`;
  }
}
