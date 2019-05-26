import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import * as utils from "../../utils";

@Component({ computed: mapState(["user"]) })
export default class CharacterAddModel extends Vue {
  characterName: string = "";
  characterLevel: number = 5;
  isFree: boolean = false;

  /**
   * Calculate how many stars it would cost to create a new level X character.
   */
  get cost(): number {
    return utils.CHARACTER_CREATION_COST[this.characterLevel];
  }
}
