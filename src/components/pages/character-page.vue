<template>
  <div v-if="character !== undefined">
    <header-bar>
      <div class="col-auto order-2 order-md-1">
        <b-dropdown id="character-select-dropdown" :text="character.name" :no-flip="true"
                    size="sm" variant="outline-secondary" menu-class="scrollable-dropdown p-0"
                    class="mr-2 mt-2 mt-md-0">
          <character-list :active-id="characterId"></character-list>
        </b-dropdown>
        <div class="btn-group btn-group-sm mt-2 mt-md-0" role="group"
             aria-label="Character management">

          <b-dropdown id="add-stars-dropdown" text="Add stars" :no-flip="true"
                      size="sm" variant="primary" :no-caret="true"
                      menu-class="large scrollable-dropdown">
            <template v-for="reward in availableRewards">
              <b-dropdown-divider v-if="reward === 'divider'"></b-dropdown-divider>
              <b-dropdown-item-button v-else @click="claimReward(reward)" :variant="reward.calculate(progress) < 0 ? 'danger' : ''">
                {{ reward.name }}<span v-if="reward.characterBound" class="font-weight-bolder"
                                       title="bound to this character">*</span>
              </b-dropdown-item-button>
            </template>

            <!-- The margin is here to compensate for the lost padding because of the scroll bar -->
            <b-dropdown-item-button v-b-modal.star-adjust-modal class="mb-2">
              Edit manually
            </b-dropdown-item-button>
          </b-dropdown>

          <b-dropdown id="modify-character-dropdown" text="Modify" :no-flip="true"
                      size="sm" variant="secondary" :no-caret="true">
            <b-dropdown-item-button v-b-modal.character-rename-modal>
              Rename
            </b-dropdown-item-button>
            <b-dropdown-item-button v-b-modal.character-delete-modal variant="danger">
              Delete
            </b-dropdown-item-button>
          </b-dropdown>
        </div>
      </div>
    </header-bar>

    <div class="row mb-2">
      <div class="col-auto">
        Level {{ level }}
      </div>
      <div class="col pl-0">
        <b-progress :max="1.0" height="1.5rem">
          <b-progress-bar :value="nextLevelProgress" :class="{ 'no-progress': nextLevelProgress < 0.1 }"
                          :label="level < 20 ? `${(nextLevelProgress * 100).toFixed(1)}%` : `${progress.banners} banners`">
          </b-progress-bar>
        </b-progress>
      </div>
    </div>

    <p v-if="user.unspent_stars > 0">
      You have <strong>{{ user.unspent_stars }}</strong> unspent stars.
    </p>

    <!-- TODO: Make collapsible -->
    <!-- TODO: Add level 20 -->
    <!-- TODO: Color filled banners differently -->
    <div v-for="bracket in levelingTable" class="card">
      <div class="card-header">
        {{ bracket.name }}
      </div>

      <div class="card-body">
        <div class="card-deck">
          <div v-for="level in bracket.levels" class="card bg-light">
            <div class="card-header">Level {{ level.level }}</div>
            <div class="card-body">
              <div class="row my-n1">
                <!-- Clicking on a banner should will buy the entire banner at once -->
                <button v-for="(banner, bannerId) in level.banners"
                        @click="levelCharacterTo(banner[banner.length - 1])" type="button"
                        class="banner col-3 my-1"
                        :title="`Level to level $(level.level) + $(bannerId + 1) banners`">
                  <!-- TODO: Perhaps inline the SVG so we can modify it with programatically -->
                  <img class="banner__background" alt="banner background" aria-hidden
                       :src="`/static/dist/images/${character.stars >= banner[banner.length - 1] ? 'banner-filled' : 'banner'}.svg`">

                  <ul :class="`banner__stars banner__stars--${banner.length}`" aria-hidden>
                    <li v-for="star in banner" class="banner__star">
                      <i :class="star <= character.stars ? 'icon-star-full' : 'icon-star-empty'"></i>
                    </li>
                  </ul>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <character-rename-modal :character-id="character.id">
    </character-rename-modal>
    <character-delete-modal :character-id="character.id">
    </character-delete-modal>
    <star-adjust-modal></star-adjust-modal>
  </div>
  <div v-else>
    <header-bar></header-bar>

    <p>The character could not be found.</p>
  </div>
</template>

<script src="./character-page.ts"></script>

<style lang="scss">
 .scrollable-dropdown {
   max-height: 20rem;
   overflow-y: scroll;
   min-width: 16rem;

   &.large {
     max-height: 25rem;
     width: unset;
   }
 }

 // The label is unreadable when the bar is at 0%
 .progress-bar > span {
   transition: color 600ms ease, padding-left 600ms ease;
 }

 .no-progress > span {
   color: #212529;
   padding-left: 0.6rem;
 }

 // The banner styling is a bit more complicated and can be found in
 // src/styles/_banners.scss
</style>
