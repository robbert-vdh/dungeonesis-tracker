<template>
  <div v-if="character !== undefined">
    <header-bar>
      <div class="col-auto order-2 order-md-1">
        <b-dropdown id="character-select-dropdown" :text="character.name" :no-flip="true"
                    size="sm" variant="outline-secondary" menu-class="scrollable-dropdown"
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

    <h3>
      TODO:
    </h3>

    <ul>
      <li>
        <strike>Buttons after character name:</strike>
        <ul>
          <li><strike>Add stars</strike></li>
          <li><strike>Rename</strike></li>
          <li><strike>Delete</strike></li>
        </ul>
      </li>
      <li><strike>Level progress bar with current level</strike></li>
      <li>Banner display similar to the actual sheet</li>
      <li>Find a spot to display how many unspent stars the player has</li>
    </ul>

    <character-rename-modal :character-id="character.id">
    </character-rename-modal>
    <character-delete-modal :character-id="character.id">
    </character-delete-modal>
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
   padding: 0;
   width: 16rem;

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
</style>
