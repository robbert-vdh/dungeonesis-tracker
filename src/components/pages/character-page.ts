import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

import { Character } from "../../store";
import * as utils from "../../utils";
import CharacterList from "../character-list.vue";
import HeaderBar from "../header-bar.vue";
import CharacterDeleteModal from "../modals/character-delete-modal.vue";
import CharacterRenameModal from "../modals/character-rename-modal.vue";

// TypeScript does not allow decorators to add properties, so we need to somehow
// work around this
interface Shim {
  characterId: number;
}

// TODO: Add manual star entry and removal.

/**
 * An ingame or out of game reward that yields stars. Completing quests yields
 * one to three banners worth of stars. This is why we have to calculate the
 * amount of stars based on the player's character.
 */
interface Reward {
  /**
   * The name of this reward as shown in the dropdown. This should include the
   * number of stars or banners for clarity's sake.
   */
  name: string;
  /**
   * Whether this reward should immediatly be applied to the current character.
   * In other words, the stars generated by this reward can not be used by other
   * characters.
   */
  characterBound: boolean;
  /**
   * How many stars this reward should yield. This number is constant for every
   * reward except for quest rewards.
   */
  calculate: (character: utils.CharacterProgression) => number;
}

@Component({
  components: {
    "character-list": CharacterList,
    "header-bar": HeaderBar,
    "character-delete-modal": CharacterDeleteModal,
    "character-rename-modal": CharacterRenameModal
  },
  props: {
    characterId: Number
  },
  computed: mapState(["user"])
})
export default class CharacterPage extends Vue {
  availableRewards: (Reward | "divider")[] = [
    {
      name: "Completed a quest (1 banner)",
      characterBound: false,
      calculate: character => utils.bannerCost(character, 1, true)
    },
    {
      name: "Completed a quest (2 banners)",
      characterBound: false,
      calculate: character => utils.bannerCost(character, 2, true)
    },
    {
      name: "Completed a quest (3 banners)",
      characterBound: false,
      calculate: character => utils.bannerCost(character, 3, true)
    },
    "divider",
    {
      name: "This character has won an NPC auction (1 star)",
      characterBound: true,
      calculate: _ => 1
    },
    {
      name: "My proposed quest was accepted (1 star)",
      characterBound: false,
      calculate: _ => 1
    },
    {
      name: "I was last session's MVP (1 star)",
      characterBound: false,
      calculate: _ => 1
    },
    {
      name: "I've written a session log (2 stars)",
      characterBound: false,
      calculate: _ => 2
    },
    {
      name: "I've created a piece of art (2 stars)",
      characterBound: false,
      calculate: _ => 2
    },
    {
      name: "I've brought snacks to share (2 stars)",
      characterBound: false,
      calculate: _ => 2
    },
    {
      name: "I've arranged a location for a session (2 stars)",
      characterBound: false,
      calculate: _ => 2
    },
    {
      name: "I've registered this character on the Drive (3 stars)",
      characterBound: true,
      calculate: _ => 3
    },
    {
      name: "I've submitted this character's backstory (4 stars)",
      characterBound: true,
      calculate: _ => 4
    },
    {
      name: "I've filled in a survey (5 stars)",
      characterBound: false,
      calculate: _ => 5
    },
    {
      name: "I've made the SDM sad with my character's death (6 stars)",
      characterBound: false,
      calculate: _ => 6
    },
    {
      name: "I've helped out with the Drive (7 stars)",
      characterBound: false,
      calculate: _ => 7
    },
    {
      name: "I've DM'ed a session (8 stars)",
      characterBound: false,
      calculate: _ => 8
    },
    "divider",
    {
      name: "Buy inspriation (-1 star)",
      characterBound: true,
      calculate: _ => -1
    }
  ];

  get character(): Character {
    return this.$store.state.characters[(<Shim>(<any>this)).characterId];
  }

  get level(): number {
    return this.progress.level;
  }

  /**
   * A fraction between 0 and 1 to indacte how far the character has progressed
   * to the next level. Will always be 1 if the character is level 20 or above.
   */
  get nextLevelProgress(): number {
    if (this.level >= 20) {
      return 1.0;
    } else {
      return utils.nextLevelProgress(this.progress);
    }
  }

  get progress(): utils.CharacterProgression {
    return utils.starsToLevel(this.character.stars);
  }

  /**
   * Claim a reward. Depending on the reward we either add stars to the star
   * pool or we add them dirextly to the character the reward is claimed from.
   */
  async claimReward(reward: Reward) {
    const rewardStars = reward.calculate(this.progress);

    if (reward.characterBound) {
      await this.$store.dispatch("adjustCharacterStars", {
        ...this.character,
        stars: this.character.stars + rewardStars,
        reason: reward.name
      });
    } else {
      await this.$store.dispatch("adjustStars", {
        stars: rewardStars,
        reason: reward.name
      });
    }
  }
}
