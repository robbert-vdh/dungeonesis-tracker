import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import { Character } from "../../store";

interface Shim {
  characters: Character[];
  characterId: number;
}

@Component({
  computed: mapState(["characters"]),
  props: { characterId: Number }
})
export default class CharacterDeleteModel extends Vue {
  confirmationName: string = "";

  /**
   * Whether we have attempted submitting the form. This is used to trigger the
   * validation since it looks rather daunting otherwise.
   */
  wasSubmitted: boolean = false;

  get character(): Character {
    return (<Shim>(<any>this)).characters[(<Shim>(<any>this)).characterId];
  }

  /**
   * Reset the fields to their defaults. This is needed because the modal gets
   * reused once rendered.
   */
  reset() {
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

    await this.$store.dispatch("deleteCharacter", this.character.id);

    // No need to hide the modal because the entire element gets removed from
    // the DOM after the character has been removed
    this.$router.push({ name: "overview" });
  }
}
