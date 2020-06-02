import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import * as utils from "../../utils";
import { UserInfo } from "../../store";

@Component({ computed: mapState(["user"]) })
export default class CharacterAddModel extends Vue {
  user!: UserInfo;

  characterName: string = "";
  characterLevel: number = 5;
  isFree: boolean = false;
  isIronMan: boolean = false;

  /**
   * Whether we have attempted submitting the form. This is used to trigger the
   * validation since it looks rather daunting otherwise.
   */
  wasSubmitted: boolean = false;

  /**
   * Calculate how many stars it would cost to create a new level X character.
   * This value will be `undefined` if it is not possible to create a character
   * at this level.
   */
  get cost(): number | undefined {
    // It is not possible to create Iron Man character starting at levels higher
    // than 6
    if (this.isIronMan && this.characterLevel > 6) {
      return undefined;
    }

    return utils.CHARACTER_CREATION_COST[this.characterLevel];
  }

  /**
   * This value is true if the player does not have enough stars to create this
   * character. This will also return true if the player tries to create a
   * character whose level is too high (level 14 and up for regular characters,
   * and 7 and up for Iron Man characters).
   */
  get insufficientStars(): boolean {
    return (
      !this.isFree &&
      // The cost will be undefined when creating characters that are too high
      // level
      (this.cost === undefined || this.cost > this.user.unspent_stars)
    );
  }

  /**
   * Reset the fields to their defaults. This is needed because the modal gets
   * reused once rendered.
   */
  reset() {
    this.characterName = "";
    this.characterLevel = 5;
    this.isFree = false;
    this.isIronMan = false;
    this.wasSubmitted = false;
  }

  /**
   * Run validations and attempt to submit the form.
   */
  async submit() {
    if (
      !(<HTMLFormElement>this.$refs.form).checkValidity() ||
      this.insufficientStars
    ) {
      this.wasSubmitted = true;
      return;
    }

    // This should be run in some kind of transaction, but unless the connection
    // drops somehwere in the middle this won't cause any problems and any
    // problems are solvable by the user anyway.
    if (this.isFree && this.cost !== undefined && this.cost > 0) {
      await this.$store.dispatch("adjustStars", {
        stars: -this.cost,
        reason: `Created a level ${this.characterLevel} ${
          this.isIronMan ? "Iron Man character" : "character"
        }`
      });
    }

    await this.$store.dispatch("createCharacter", {
      name: this.characterName,
      stars: utils.levelToStars(this.characterLevel),
      iron_man: this.isIronMan
    });

    await this.$nextTick();
    (<any>this.$refs.modal).hide();
  }
}
