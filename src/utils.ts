/**
 * This module is a port of `exptracker/utils.py` with some additional
 * functions. Everything here is explained in more detail in that file. The main
 * idea here is that we only store stars internally and that we convert between
 * the raw number of stars and a human readable representation (levels, banners
 * and remaining stars) when needed. This representation is also useful when
 * leveling characters and adding rewards.
 */

// TODO: Add a function to calculate the current progress to the next level.

export const BANNERS_PER_LEVEL: number = 8;

export const STARS_PER_BANNER: { [level: number]: number } = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 2,
  6: 2,
  7: 2,
  8: 3,
  9: 3,
  10: 3,
  11: 4,
  12: 4,
  13: 4,
  14: 5,
  15: 5,
  16: 5,
  17: 6,
  18: 6,
  19: 6,
  20: 6
};

// We can use the above values to calculate how many stars we need to reach a
// certain level
let starsForLevel: { [level: number]: number } = { 1: 0 };
for (const [levelKey, bannerCost] of Object.entries(STARS_PER_BANNER)) {
  const level = Number(levelKey);
  if (level >= 20) {
    continue;
  }

  const lastLevelRequirement = starsForLevel[level];
  starsForLevel[level + 1] =
    lastLevelRequirement + bannerCost * BANNERS_PER_LEVEL;
}

export const STARS_FOR_LEVEL: { [level: number]: number } = starsForLevel;

const reversedLevels = Object.keys(STARS_FOR_LEVEL)
  .map(Number)
  .sort((a, b) => b - a);

/**
 * The progression of a character. This includes the character's level, the
 * number of banners towards the next level the character currently has and the
 * number of stars towards the next banner the character currently possesses.
 */
export interface CharacterProgression {
  level: number;
  banners: number;
  stars: number;
}

// The functions below are documented in detail in `exptracker/utils.py`
export function starsToLevel(characterStars: number): CharacterProgression {
  let level = 0;
  let levelCost = STARS_FOR_LEVEL[2];
  for (const l of reversedLevels) {
    if (characterStars >= STARS_FOR_LEVEL[l]) {
      level = l;
      levelCost = STARS_FOR_LEVEL[l];
      break;
    }
  }

  const bannerCost = STARS_PER_BANNER[level];
  const banners = Math.floor((characterStars - levelCost) / bannerCost);
  const remainingStars = characterStars - levelCost - banners * bannerCost;

  return {
    level,
    banners,
    stars: remainingStars
  };
}

export function levelToStars(level: number): number {
  return STARS_FOR_LEVEL[level] || 0;
}

/**
 * Calculate how for the character has progressed towards the next level.
 *
 * @param progression - A character's current progression.
 *
 * @returns How for the character has progressed towards the next level as a
 *   fraction between 0 and 1. Will return the number of banners for level 20
 *   characters.
 */
export function nextLeveLprogress(character: CharacterProgression): number {
  if (character.level >= 20) {
    return character.banners;
  }

  return (
    (character.banners + character.stars * STARS_PER_BANNER[character.level]) /
    BANNERS_PER_LEVEL
  );
}
