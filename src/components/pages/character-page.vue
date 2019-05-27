<template>
  <div v-if="character !== undefined">
    <b-dropdown id="character-select-dropdown" :text="character.name" :no-flip="true"
                menu-class="scrollable-dropdown" variant="outline-secondary" class="mb-3">
      <character-list :active-id="id"></character-list>
    </b-dropdown>

    <p>({{ character.stars }} stars)</p>

    <p>You have <strong>{{ user.unspent_stars }}</strong> unspent stars.</p>

    <h3>TODO:</h3>

    <ul>
      <li>Character selection dropdown</li>
      <li>
        Buttons after character name:
        <ul>
          <li>Add stars</li>
          <li>Rename</li>
          <li>Delete</li>
        </ul>
      </li>
      <li>Level progress bar with current level</li>
      <li>Banner display similar to the actual sheet</li>
      <li>Find a spot to display how many unspent stars the player has</li>
    </ul>
  </div>
  <p v-else>
    The character could not be found.
  </p>
</template>

<script src="./character-page.ts"></script>

<style lang="scss">
 .scrollable-dropdown {
   height: 20rem;
   overflow-y: scroll;
   padding: 0;
   width: 16rem;
 }
</style>
