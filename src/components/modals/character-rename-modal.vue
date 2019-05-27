<template>
  <b-modal ref="modal" @show="reset" @ok.prevent="submit"
           id="character-rename-modal" :title="`Rename ${character.name}`">
    <form ref="form" @submit.stop.prevent="submit"
          :class="{ 'was-validated': wasSubmitted }" novalidate>
      <div class="form-group">
        <label for="character-rename-name">New name</label>
        <input v-model="newName" :placeholder="character.name" type="text"
               class="form-control" id="character-rename-name" required>
      </div>
    </form>
  </b-modal>
</template>

<script src="./character-rename-modal.ts"></script>
