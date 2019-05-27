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
                      size="sm" variant="primary" :no-caret="true">
            TODO:
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

    <p>({{ character.stars }} stars)</p>

    <p>You have <strong>{{ user.unspent_stars }}</strong> unspent stars.</p>

    <h3>
      TODO:
    </h3>

    <ul>
      <li>
        Buttons after character name:
        <ul>
          <li>Add stars</li>
          <li><strike>Rename</strike></li>
          <li><strike>Delete</strike></li>
        </ul>
      </li>
      <li>Level progress bar with current level</li>
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
 }
</style>
