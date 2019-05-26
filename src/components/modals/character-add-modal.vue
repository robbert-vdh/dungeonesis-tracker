<template>
  <b-modal ref="modal" @show="reset" @ok.prevent="submit"
           :ok-disabled="insufficientStars" id="character-add-modal"
           title="Add a character">
    <form ref="form" @submit.stop.prevent="submit" class="mb-3"
          :class="{ 'was-validated': wasSubmitted }" novalidate>
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
          Do not spend any stars when adding this character. Normally creating a
          new character costs stars starting at level six or higher.
        </small>
      </div>
    </form>

    <p>
      Cost:
      <span v-if="isFree || cost === 0">FREE</span>
      <span v-else :class="{ 'text-danger': insufficientStars }">
        {{ cost }} stars ({{ user.unspent_stars }} available)
      </span>
    </p>
  </b-modal>
</template>

<script src="./character-add-modal.ts"></script>
