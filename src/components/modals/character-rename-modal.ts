import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { mapState } from "vuex";

import { Character } from "../../store";

@Component({
  computed: mapState(["characters"]),
  props: { characterId: Number }
})
export default class CharacterRenameModel extends Vue {
  @Prop({ type: Number, required: true }) characterId!: number;
  characters!: Character[];

  newName: string = "";

  /**
   * Whether we have attempted submitting the form. This is used to trigger the
   * validation since it looks rather daunting otherwise.
   */
  wasSubmitted: boolean = false;

  get character(): Character {
    return this.characters[this.characterId];
  }

  /**
   * Reset the fields to their defaults. This is needed because the modal gets
   * reused once rendered.
   */
  reset() {
    this.newName = "";
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
