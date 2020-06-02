/**
 * This module is a port of `exptracker/utils.py` with some additional
 * functions. Everything here is explained in more detail in that file. The main
 * idea here is that we only store stars internally and that we convert between
 * the raw number of stars and a human readable representation (levels, banners
 * and remaining stars) when needed. This representation is also useful when
 * leveling characters and adding rewards.
 */

import * as _ from "lodash";

export const CHARACTER_CREATION_COST: { [level: number]: number } = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 1,
  7: 3,
  8: 5,
  9: 10,
  10: 15,
  11: 20,
  12: 25,
  13: 30
};

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
  20: 6,
  21: 6,
  22: 6,
  23: 6,
  24: 6,
  25: 6
};

/**
 * Return the number of banners needed to level up at a certain level.
 */
export function bannersPerLevel(level: number): number {
  if (level < 20) {
    return 8;
  } else {
    return 16;
  }
}

// We can use the above values to calculate how many stars we need to reach a
// certain level
let starsForLevel: { [level: number]: number } = { 1: 0 };
for (const [levelKey, bannerCost] of Object.entries(STARS_PER_BANNER)) {
  const level = Number(levelKey);

  const lastLevelRequirement = starsForLevel[level];
  starsForLevel[level + 1] =
    lastLevelRequirement + bannerCost * bannersPerLevel(level);
}

export const STARS_FOR_LEVEL: { [level: number]: number } = starsForLevel;

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

/**
 * The entire character progression path divided into sections, levels, banners
 * and stars. This is built programatically in `buildLevelingTable()` and is
 * used in the front end to iterate over.
 */
export type LevelingTable = TableSection[];

export interface TableSection {
  name: string;
  levels: TableLevel[];
}

export interface TableLevel {
  level: number;
  banners: TableBanner[];
}

/**
 * The values here should be, for every star part of the banner, the number of
 * that star. This means that every value in this array should be unique for the
 * entire LevelingTable. We'll use this in the front end to color in the stars
 * by comparing these numbers to the number of stars the character has. An
 * example for the first level is listed below. The number of elements in this
 * array depends on the cost of the banner.
 *
 * TODO: Find a way to make this clearer, since it's still pretty confusing
 *
 * @example
 * const table: LevelingTable = [
 *   {
 *     name: "Recruit (levels 1-5)",
 *     levels: [
 *       {
 *         level: 1,
 *         banners: [[1], [2], [3], [4], [5], [6], [7], [8]]
 *       },
 *       ...
 *     ]
 *   },
 *   ...
 * ]
 */
export type TableBanner = number[];

const reversedLevels = Object.keys(STARS_FOR_LEVEL)
  .map(Number)
  .sort((a, b) => b - a);

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
  return _.get(STARS_FOR_LEVEL, level, 0);
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
export function nextLevelProgress(character: CharacterProgression): number {
  if (character.level >= 20) {
    return character.banners;
  }

  return (
    (character.banners + character.stars / STARS_PER_BANNER[character.level]) /
    bannersPerLevel(character.level)
  );
}

/**
 * Calculate the leveling table from the constants defined above. This table can
 * be iterated over on the character detail page to show the exact leveling
 * progress.
 */
function buildLevelingTable(): LevelingTable {
  const sections = [
    { name: "Recruit (levels 1-4)", levels: [1, 2, 3, 4] },
    { name: "Mercenary (levels 5-7)", levels: [5, 6, 7] },
    { name: "Private (levels 8-10)", levels: [8, 9, 10] },
    { name: "Veteran (levels 11-13)", levels: [11, 12, 13] },
    { name: "Elite (levels 14-16)", levels: [14, 15, 16] },
    { name: "Marshal (levels 17-19)", levels: [17, 18, 19] },
    // The levels above 20 are only symbolic tiers used for rewards, and they
    // are hidden by default
    { name: "Legend (level 20)", levels: [20, 21, 22, 23, 24, 25] }
  ];

  // Because we need to keep track of the current star number (see
  // `TableBanner`'s docstring) this step is performed iteratively. This feels
  // and looks weird we are simply mapping the above list of sections to the
  // format of `LevelingTable`.
  let currentStar = 1;
  let table: LevelingTable = [];
  for (const section of sections) {
    let levels: TableLevel[] = [];
    for (const level of section.levels) {
      let banners: TableBanner[] = [];

      const numBanners = bannersPerLevel(level);
      for (let bannerId = 0; bannerId < numBanners; bannerId++) {
        let stars: number[] = [];
        for (let starId = 0; starId < STARS_PER_BANNER[level]; starId++) {
          stars.push(currentStar++);
        }

        banners.push(stars);
      }

      levels.push({ level: level, banners });
    }

    table.push({ name: section.name, levels });
  }

  return table;
}

export const LEVELING_TABLE: LevelingTable = buildLevelingTable();

export function formatLevel(level: number): string {
  if (level <= 20) {
    return String(level);
  } else {
    return "20" + "?".repeat(level - 20);
  }
}
