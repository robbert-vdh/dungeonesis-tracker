import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import { Character, LogEntry } from "../../store";
import { starsToLevel } from "../../utils";

// TODO: Trigger a refresh whenever the modal gets opened

@Component({ computed: mapState(["characters", "logs"]) })
export default class LogsModal extends Vue {
  characters!: { [id: number]: Character };
  logs!: LogEntry[];

  async fetchLogs() {
    await this.$store.dispatch("fetchLogs");
  }

  /**
   * Calculate the level of a character with the given numer of stars. This is
   * used to display the level of newly created characters.
   */
  calculateLevel(stars: number): number {
    return starsToLevel(stars).level;
  }

  /**
   * Retrieve the name of the character with the given id. If the character (no
   * longer) exists, return null.
   */
  characterName(id: number): string | null {
    const character = this.characters[id];

    if (character !== undefined) {
      return character.name;
    } else {
      return null;
    }
  }

  /**
   * Format an ISO timestamp into something readable.
   */
  formatDate(isoDate: string): string {
    const date = new Date(isoDate);

    return date.toLocaleString("en-GB", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
  }
}
