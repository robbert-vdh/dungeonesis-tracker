<template>
  <b-modal id="character-add-modal" title="Add a character">
    <!-- TODO: Add validation -->
    <!-- TODO: Hook up the submit event -->
    <form class="needs-validation mb-3" novalidate>
      <div class="form-group">
        <label for="character-add-name">Character name</label>
        <input v-model="characterName" type="text" class="form-control"
               id="character-add-name" required>
      </div>
      <div class="form-group">
        <label for="character-add-level">Starting level</label>
        <input v-model="characterLevel" type="number" class="form-control"
               id="character-add-level" min="1" max="20" required>
      </div>
      <div class="custom-control custom-checkbox">
        <input v-model="isFree" type="checkbox" class="custom-control-input"
               id="character-add-free" aria-describedby="custom-character-add-free-help">
        <label class="custom-control-label" for="character-add-free">
          Import existing character
        </label>
        <small id="character-add-free-help" class="form-text text-muted">
          Do not spend any stars when adding the character. Creating a new
          character costs stars starting at level six or higher.
        </small>
      </div>
    </form>

    <!-- TODO: Display in red if the user does not have enough stars -->
    <!-- TODO: Disable the OK button if the user does not have enough stars -->
    <p>
      Cost:
      <span v-if="isFree || cost === 0">FREE</span>
      <span v-else>{{ cost }} stars ({{ user.unspent_stars }} available)</span>
    </p>
  </b-modal>
</template>

<script src="./character-add-modal.ts"></script>
