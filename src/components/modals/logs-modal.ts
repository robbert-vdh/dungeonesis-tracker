import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import { LogEntry } from "../../store";

// TODO: Trigger a refresh whenever the modal gets opened

@Component({ computed: mapState(["logs"]) })
export default class LogsModal extends Vue {
  logs!: LogEntry[];

  async fetchLogs() {
    await this.$store.dispatch("fetchLogs");
  }
}
