import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import { Character, UserInfo } from "../../store";

interface Shim {
  characters: Character[];
  id: number;
  user: UserInfo;
}

@Component({
  computed: mapState(["characters", "user"]),
  props: { id: Number }
})
export default class CharacterRenameModel extends Vue {
  newName: string = "";
  oldName: string = "";

  /**
   * Whether we have attempted submitting the form. This is used to trigger the
   * validation since it looks rather daunting otherwise.
   */
  wasSubmitted: boolean = false;

  created() {
    this.oldName = this.character.name;
  }

  get character(): Character {
    return (<Shim>(<any>this)).characters[(<Shim>(<any>this)).id];
  }

  /**
   * Reset the fields to their defaults. This is needed because the modal gets
   * reused once rendered.
   */
  reset() {
    this.newName = "";
    this.oldName = this.character.name;
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

    await this.$store.dispatch("renameCharacter", {
      id: this.character.id,
      name: this.newName
    });

    await this.$nextTick;
    (<any>this.$refs.modal).hide();
  }
}
