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

  /**
   * Reset the fields to their defaults. This is needed because the modal gets
   * reused once rendered.
   */
  reset() {
    // TODO: Reset any form validation errors of needed
    this.characterName = "";
    this.characterLevel = 5;
    this.isFree = false;
  }
}
