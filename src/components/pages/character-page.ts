import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { mapState } from "vuex";
import * as _ from "lodash";

import { Character, UserInfo } from "../../store";
import * as utils from "../../utils";
import CharacterList from "../character-list.vue";
import HeaderBar from "../header-bar.vue";
import CharacterDeleteModal from "../modals/character-delete-modal.vue";
import CharacterRenameModal from "../modals/character-rename-modal.vue";
import StarAdjustModal from "../modals/star-adjust-modal.vue";

/**
 * The background image for the banners. We will load it inline in an `<svg>`
 * instead instead of as in image so that we can use CSS to modify the banners
 * depending on the situation.
 */
import BannerBackgroundSvg from "!!vue-svg-loader!../../images/banner.svg";

/**
 * The distribution of stars gained from receiving a reward. This is needed
 * because some of the rewards are bound to the character earning them.
 */
interface RewardStars {
  globalStars: number;
  characterBoundStars: number;
}

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
   * How many stars this reward should yield. This number is constant for every
   * reward except for quest rewards.
   */
  calculate: (character: utils.CharacterProgression) => RewardStars;
}

Component.registerHooks(["beforeRouteUpdate"]);

@Component({
  components: {
    "banner-background-svg": BannerBackgroundSvg,
    "character-list": CharacterList,
    "header-bar": HeaderBar,
    "character-delete-modal": CharacterDeleteModal,
    "character-rename-modal": CharacterRenameModal,
    "star-adjust-modal": StarAdjustModal
  },
  props: {
    characterId: Number
  },
  computed: mapState(["user"])
})
export default class CharacterPage extends Vue {
  @Prop({ type: Number, required: true }) characterId!: number;
  user!: UserInfo;

  /**
   * Indicates whether a section (level range) in the leveling table should
   * start collapsed. All sections that a character has already fulfilled will
   * be collapsed by default to minimize clutter. These values are calculated
   * when the displayed character changes in `collapseSections()`.
   */
  collapsedSections: { [section: string]: boolean } = {};

  /**
   * Wheter the animatinos should be disabled. This is used to briefly disable
   * and restart the animations whenever the amount of stars allocated to a
   * character changes. This ensures that every animation is in sync.
   */
  disableAnimations: boolean = false;

  /**
   * On non-touch screens the character selection dropdown closes as you would
   * expect after clicking on a vue-router link, but this does not happen
   * automatically on touch events. There might be a better solution here than
   * closing the dropdown manually.
   */
  beforeRouteUpdate(_from: Route, _to: Route, next: () => void) {
    (<BDropdown>this.$refs.characterSelectDropdown).hide(true);

    next();
  }

  created() {
    // Property watchers don't fire on page load
    this.collapseSections();
  }

  /**
   * Collapse any sections of the leveling table that have been completely
   * fulfilled. In other words, only show levels higher than the character's
   * level by default.
   */
  @Watch("characterId")
  collapseSections() {
    this.collapsedSections = {};

    for (const section of this.levelingTable) {
      this.collapsedSections[section.name] =
        section.levels[section.levels.length - 1].level < this.level;
    }
  }

  get availableRewards(): (Reward | "divider")[] {
    return [
      {
        name: "Completed a quest (2 stars)",
        calculate: _ => splitReward(2)
      },
      {
        name: "Completed a quest (4 stars)",
        calculate: _ => splitReward(4)
      },
      {
        name: "Completed a quest (5 stars)",
        calculate: _ => splitReward(5)
      },
      {
        name: "Completed a quest (6 stars)",
        calculate: _ => splitReward(6)
      },
      {
        name: "Completed a quest (8 stars)",
        calculate: _ => splitReward(8)
      },
      {
        name: "Completed a quest (10 stars)",
        calculate: _ => splitReward(10)
      },
      {
        name: "Completed a quest (12 stars)",
        calculate: _ => splitReward(12)
      },
      "divider",
      {
        name: "This character has won an NPC auction (1 star)",
        calculate: _ => ({ globalStars: 0, characterBoundStars: 1 })
      },
      {
        name: "My proposed quest was accepted (1 star)",
        calculate: _ => ({ globalStars: 1, characterBoundStars: 0 })
      },
      {
        name: "I was last session's MVP (1 star)",
        calculate: _ => ({ globalStars: 1, characterBoundStars: 0 })
      },
      {
        name: "I've written a session log (2 stars)",
        calculate: _ => ({ globalStars: 2, characterBoundStars: 0 })
      },
      {
        name: "I've written lore for my own campaign (2 stars)",
        calculate: _ => ({ globalStars: 2, characterBoundStars: 0 })
      },
      {
        name: "I've created a piece of art (2 stars)",
        calculate: _ => ({ globalStars: 2, characterBoundStars: 0 })
      },
      {
        name: "I've brought snacks to share (2 stars)",
        calculate: _ => ({ globalStars: 2, characterBoundStars: 0 })
      },
      {
        name: "I've arranged a location for a session (2 stars)",
        calculate: _ => ({ globalStars: 2, characterBoundStars: 0 })
      },
      {
        name: "I've registered this character on the Drive (3 stars)",
        calculate: _ => ({ globalStars: 0, characterBoundStars: 3 })
      },
      {
        name: "I've submitted this character's backstory (4 stars)",
        calculate: _ => ({ globalStars: 0, characterBoundStars: 4 })
      },
      {
        name: "I've filled in a survey (5 stars)",
        calculate: _ => ({ globalStars: 5, characterBoundStars: 0 })
      },
      {
        name: "I've made the SDM sad with my character's death (6 stars)",
        calculate: _ => ({ globalStars: 6, characterBoundStars: 0 })
      },
      {
        name: "I've helped out with the Drive (7 stars)",
        calculate: _ => ({ globalStars: 7, characterBoundStars: 0 })
      },
      {
        name: "I've DM'ed a session (8 stars)",
        calculate: _ => ({ globalStars: 8, characterBoundStars: 0 })
      },
      "divider",
      {
        name: "I've received an inspiration star (1 star)",
        calculate: _ => ({ globalStars: 1, characterBoundStars: 0 })
      },
      {
        name: "Buy inspriation (-1 star)",
        calculate: _ => ({ globalStars: -1, characterBoundStars: 0 })
      }
    ];
  }

  get character(): Character {
    return this.$store.state.characters[this.characterId];
  }

  get level(): number {
    return this.progress.level;
  }

  get levelingTable(): utils.LevelingTable {
    return utils.LEVELING_TABLE;
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
   * Determine which classes to apply to a banner based on the character's level
   * and whether the player can afford to purchase the banner.
   */
  bannerClasses(level: utils.TableLevel, banner: utils.TableBanner): string[] {
    let classes = [];
    if (level.level === 20) {
      classes.push("col-sm-1-5");
    }

    const bannerCost = banner[banner.length - 1];
    if (this.character.stars >= bannerCost) {
      classes.push("banner--filled");
    } else if (
      bannerCost - this.character.stars <= this.user.unspent_stars &&
      !this.disableAnimations
    ) {
      classes.push("banner--can-afford");
    }

    return classes;
  }

  /**
   * Claim a reward. Depending on the reward we either add stars to the global
   * star pool, directly to the character that earned the reward or both.
   */
  async claimReward(reward: Reward) {
    const { globalStars, characterBoundStars } = reward.calculate(
      this.progress
    );

    // The two reward types don't interact, so we can process them both at the
    // same time.
    let rewardPromises = [];

    if (globalStars !== 0) {
      rewardPromises.push(
        new Promise(async next => {
          await this.$store.dispatch("adjustStars", {
            stars: globalStars,
            reason: reward.name
          });

          this.resetAnimations();
          next();
        })
      );
    }

    if (characterBoundStars !== 0) {
      rewardPromises.push(
        new Promise(async next => {
          const oldProgress = _.clone(this.progress);
          await this.$store.dispatch("setCharacterStars", {
            ...this.character,
            stars: this.character.stars + characterBoundStars,
            reason: reward.name
          });

          this.handleLevelUp(oldProgress, this.progress);
          next();
        })
      );
    }

    await Promise.all(rewardPromises);
  }

  /**
   * Show a toast if the character levels up from spending stars. Explosions and
   * Mariachi band would have been better but this will do for now. Vue's
   * reactivity somehow updates properties before the store action promises are
   * resolved, so `this.progress` will have changed immediatly after we've
   * commited an action.
   *
   * TODO: Perhaps still add some explosions
   */
  handleLevelUp(
    before: utils.CharacterProgression,
    after: utils.CharacterProgression
  ) {
    if (after.level > before.level) {
      this.$bvToast.toast(`You're now level ${after.level}!`, {
        title: "Level up",
        variant: "success"
      });
    }

    // Resetting animations is only necessary if the player now has fewer
    // banners than before, otherwise the animation for new banner will be out
    // of sync with the existing banners
    if (after.level < before.level || after.banners < before.banners) {
      this.resetAnimations();
    }
  }

  /**
   * Helper function to determine whether a reward purely modifies the current
   * character's stars.
   */
  isRewardCharacterBound(reward: Reward): boolean {
    const { globalStars, characterBoundStars } = reward.calculate(
      this.progress
    );

    // Quest rewards also modify the character's own stars but these should not
    // be considered character bound, hence the `global === 0`
    return globalStars === 0 && characterBoundStars !== 0;
  }

  /**
   * Helper function to determine whether a 'reward' costs stars rather than
   * actually giving stars.
   */
  isRewardNegative(reward: Reward): boolean {
    const { globalStars, characterBoundStars } = reward.calculate(
      this.progress
    );

    return globalStars < 0 || characterBoundStars < 0;
  }

  /**
   * Level up a character to the specified amount of stars. We specify stars
   * here instead of an exact combination of level and banners since this number
   * is already known and in use. See `utils.LEVELING_TABLE` for more
   * information.
   */
  async levelCharacterTo(stars: number) {
    const delta = stars - this.character.stars;
    if (delta === 0) {
      return;
    }

    const oldProgress = _.clone(this.progress);
    await this.$store.dispatch("spendStars", {
      id: this.character.id,
      stars: delta
    });

    this.handleLevelUp(oldProgress, this.progress);
  }

  /**
   * Reset all animations by briefly setting `disableAnimations`. This is used
   * to reapply the animation class causing the animation to restart.
   */
  async resetAnimations() {
    this.disableAnimations = true;
    await new Promise(x => setTimeout(x, 1));
    this.disableAnimations = false;
  }
}

/**
 * Devide a quest reward into two. Half the stars rewarded should go directly to
 * the character earning htem, and the other half will be added to the global
 * star pool.
 */
function splitReward(stars: number): RewardStars {
  return {
    globalStars: Math.ceil(stars / 2),
    characterBoundStars: Math.floor(stars / 2)
  };
}
