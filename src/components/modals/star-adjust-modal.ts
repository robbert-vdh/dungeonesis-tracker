import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import * as utils from "../../utils";
import { UserInfo } from "../../store";

interface Shim {
  user: UserInfo;
}

@Component({ computed: mapState(["user"]) })
export default class StarAdjustModal extends Vue {
  stars: number = 0;
  reason: string = "";

  /**
   * Whether we have attempted submitting the form. This is used to trigger the
   * validation since it looks rather daunting otherwise.
   */
  wasSubmitted: boolean = false;

  created() {
    this.stars = (<Shim>(<any>this)).user.unspent_stars;
  }

  get delta(): number {
    return this.stars - (<Shim>(<any>this)).user.unspent_stars;
  }

  /**
   * Reset the fields to their defaults. This is needed because the modal gets
   * reused once rendered.
   */
  reset() {
    this.stars = (<Shim>(<any>this)).user.unspent_stars;
    this.reason = "";
  }

  /**
   * Run validations and attempt to submit the form.
   */
  async submit() {
    if (!(<HTMLFormElement>this.$refs.form).checkValidity()) {
      this.wasSubmitted = true;
      return;
    }

    await this.$store.dispatch("adjustStars", {
      stars: this.delta,
      reason: this.reason.trim() !== "" ? this.reason : null
    });

    await this.$nextTick;
    (<any>this.$refs.modal).hide();
  }
}
