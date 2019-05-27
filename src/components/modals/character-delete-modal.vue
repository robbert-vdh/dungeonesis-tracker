<template>
  <b-modal ref="modal" @show="reset" @ok.prevent="submit"
           :ok-disabled="confirmationName !== character.name"
           id="character-delete-modal" :title="`Really delete ${character.name}?`"
           ok-variant="danger" ok-title="Begone">

    <p>Please type the character's name below to confirm.</p>

    <form ref="form" @submit.stop.prevent="submit"
          :class="{ 'was-validated': wasSubmitted }" novalidate>
      <input v-model="confirmationName" :placeholder="character.name" type="text"
             class="form-control" id="character-delete-name" :pattern="character.name"
             required>
    </form>
  </b-modal>
</template>

<script src="./character-delete-modal.ts"></script>
