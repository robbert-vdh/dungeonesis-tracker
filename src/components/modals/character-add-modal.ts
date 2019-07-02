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

  /**
   * Whether we have attempted submitting the form. This is used to trigger the
   * validation since it looks rather daunting otherwise.
   */
  wasSubmitted: boolean = false;

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
    return (
      !this.isFree &&
      (this.cost > this.user.unspent_stars || this.cost === undefined)
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
    this.wasSubmitted = false;
  }

  /**
   * Run validations and attempt to submit the form.
   */
  async submit() {
    if (!(<HTMLFormElement>this.$refs.form).checkValidity()) {
      this.wasSubmitted = true;
      return;
    }

    if (!this.isFree && this.cost > 0) {
      await this.$store.dispatch("adjustStars", {
        stars: -this.cost,
        reason: `Created a level ${this.characterLevel} character`
      });
    }

    await this.$store.dispatch("createCharacter", {
      name: this.characterName,
      stars: utils.levelToStars(this.characterLevel)
    });

    await this.$nextTick;
    (<any>this.$refs.modal).hide();
  }
}
