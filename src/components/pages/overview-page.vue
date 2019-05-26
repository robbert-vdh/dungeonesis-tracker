<template>
  <div>
    <!-- TODO: Add buttons for adding and removing characters -->
    <!-- TODO: Add a button for renaming a character to the character detail page -->

    <div class="list-group">
      <!-- TODO: Route to the correct page -->
      <a v-for="character in characters"
         href="#"
         class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
        {{ character.name }}
        <span class="badge badge-primary badge-pill">
          {{ calculateProgress(character.stars) }}
        </span>
      </a>
    </div>
  </div>
</template>

<script src="./overview-page.ts"></script>
