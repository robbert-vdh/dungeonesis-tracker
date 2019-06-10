import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import ChangelogContents from "../../../CHANGELOG.md";

@Component({})
export default class ChangelogModal extends Vue {
  @Prop({ type: Boolean, default: false }) startVisible!: boolean;

  // The contents of the changelog modal are taken directly from the
  // CHANGELOG.md file in the root of the repository. Since the modal already
  // has a title we will get rid of the first line to prevent duplicate <H1>s.
  get contents(): string {
    return ChangelogContents.split("\n")
      .slice(1)
      .join("\n");
  }
}
