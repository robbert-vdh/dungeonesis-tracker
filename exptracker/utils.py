"""
This module contains some constants and utilities for converting between
stars and levels.

The EXP system works as follows:

- To advance to the next level, you need to acquare 8 banners.
- Banners can be bought with stars. A banner costs a single star at level one,
  with the cost of a banner increasing by a single star for every three levels
  after the fifth level.

The rules are implemented here mostly for reference since the EXP system is
rather freeform and does not have a lot of rules. These conversion functions
are also separately implemented in the front end to allow for easy display of
and modifications to a character's progress.

"""

# The number of banners needed to achieve a single level.
BANNERS_PER_LEVEL = 8

# The number stars needed to purchase a banner for a character of a certain
# level. These values are hardcoded here for convenience since there are only a
# few of them and it makes calculations a lot simpler and clearer.
#
# The TypeScript version includes some more levels after level 20, but those are
# purely for comestic purposes.
STARS_PER_BANNER = {
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
}

# We can use the above values to calculate how many stars we need to reach a
# certain level
STARS_FOR_LEVEL = {1: 0}
for level, banner_cost in STARS_PER_BANNER.items():
    # There's no progression after level 20, only awesomeness
    if level >= 20:
        continue

    last_level_requirement = STARS_FOR_LEVEL[level]
    STARS_FOR_LEVEL[level + 1] = (
        last_level_requirement + banner_cost * BANNERS_PER_LEVEL
    )

LEVELS = list(sorted(STARS_FOR_LEVEL.keys()))


def stars_to_level(character_stars):
    """
    Convert between stars and level progression.

    Parameters
    ----------
    character_stars : int
        The number of stars a character has.

    Returns
    -------
    level : int
        The character's current level.
    banners : int
        The number of banners towards the next level the character currently
        possesses.
    stars : int
        The number of stars towards the next banner the character currently
        possesses.

    """

    # We can determine a character's level from the leveling table above and
    # calculate the rest from there
    level, level_cost = next(
        (
            (level, STARS_FOR_LEVEL[level])
            for level in reversed(LEVELS)
            if character_stars >= STARS_FOR_LEVEL[level]
        ),
        (0, STARS_FOR_LEVEL[2]),
    )

    banner_cost = STARS_PER_BANNER[level]
    banners = (character_stars - level_cost) // banner_cost
    remaining_stars = character_stars - level_cost - (banners * banner_cost)

    return level, banners, remaining_stars


def level_to_stars(level):
    """
    Calculate how many stars are needed to reach a certain level.

    This is useful when adding new characters.

    Parameters
    ----------
    level : int
        The character's level.

    Returns
    -------
    int
        The number of stars needed to reach this level.

    """

    return STARS_FOR_LEVEL.get(level, 0)
