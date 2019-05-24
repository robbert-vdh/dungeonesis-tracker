<template>
  <div v-if="character !== undefined">
    <h1>{{ character.name }}</h1>

    <p>({{ character.stars }} stars)</p>
  </div>
  <p v-else>
    The character could not be found.
  </p>
</template>

<script src="./character-page.ts"></script>
