/**
 * This module is a port of `exptracker/utils.py` with some additional
 * functions. Everything here is explained in more detail in that file. The main
 * idea here is that we only store stars internally and that we convert between
 * the raw number of stars and a human readable representation (levels, banners
 * and remaining stars) when needed. This representation is also useful when
 * leveling characters and adding rewards.
 */

import * as _ from "lodash";

export const BANNERS_PER_LEVEL: number = 8;

export const CHARACTER_CREATION_COST: { [level: number]: number } = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 1,
  7: 1,
  8: 5,
  9: 5,
  10: 5,
  11: 20,
  12: 20,
  13: 20,
  14: 40,
  15: 40,
  16: 40,
  17: 80,
  18: 80,
  19: 80,
  20: 42069
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
    BANNERS_PER_LEVEL
  );
}

/**
 * Calculate how many stars it would cost to buy N banners for a character.
 *
 * This is used when leveling characters and when deciding quest rewards.
 *
 * @param character - The character used for the calculations.
 * @param banners - How many banners should be bought at once. Or in the case
 *   for quest rewards: how many banners was the quest worth.
 * @param wholeBanners - Whether to round the number of banners down. This is
 *   important for calculating quest rewards to stay consistent with the pen and
 *   paper system. In our implementation it does not matter if a character has
 *   partial banners, this would otherwise result in slightly higher rewards if
 *   a character is close to leveling up.
 *
 * @returns The number of stars it would cost to acquire this many banners.
 */
export function bannerCost(
  character: CharacterProgression,
  banners: number,
  wholeBanners: boolean = false
): number {
  if (banners <= 0) {
    return 0;
  }

  let newCharacter: CharacterProgression = Object.assign({}, character);
  if (wholeBanners) {
    newCharacter.stars = 0;
  }

  // The calculation could simply be split into two if banners would always be 8
  // or lower, but this is sadly not the case so we'll just do it naively to
  // avoid making errors.
  let cost = 0;
  for (let i = 0; i < banners; i++) {
    cost += STARS_PER_BANNER[character.level] - newCharacter.stars;

    newCharacter.stars = 0;
    if (
      newCharacter.banners == BANNERS_PER_LEVEL - 1 &&
      newCharacter.level < 20
    ) {
      newCharacter.banners = 0;
      newCharacter.level += 1;
    } else {
      newCharacter.banners += 1;
    }
  }

  return cost;
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
    { name: "Legend (level 20)", levels: [20] }
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

      // TODO: Make BANNERS_PER_LEVEL a function, maybe
      let numBanners = level < 20 ? BANNERS_PER_LEVEL : 16;
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
