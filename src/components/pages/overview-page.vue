<template>
  <div>
    <!-- TODO: Add buttons for adding and removing characters -->
    <!-- TODO: Add a button for renaming a character to the character detail page -->

    <ul>
      <li v-for="character in characters">
        {{ character.name }} ({{ character.stars }} stars)
      </li>
    </ul>
  </div>
</template>

<script src="./overview-page.ts"></script>
