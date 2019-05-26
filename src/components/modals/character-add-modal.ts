import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import * as utils from "../../utils";
import { UserInfo } from "../../store";

interface Shim {
  user: UserInfo;
}

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
   * This value is true if the player does not have enough stars to create this
   * character.
   */
  get insufficientStars(): boolean {
    return this.cost > (<Shim>(<any>this)).user.unspent_stars && !this.isFree;
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
