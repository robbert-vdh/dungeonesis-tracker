<template>
  <div>
    <!-- TODO: Add a button for removing characters -->
    <!-- TODO: Add the page for adding characters -->
    <!-- TODO: Add a button for renaming a character to the character detail page -->

    <!-- TODO: Move this list and the status button to a separate component so we can use it in a dropdown -->
    <div v-if="characters.length > 0" class="list-group">
      <router-link v-for="character in characters"
                   :key="character.id"
                   :to="{ name: 'detail', params: { id: character.id } }"
                   class="list-group-item list-group-item-action d-flex
                          justify-content-between align-items-center">
        {{ character.name }}
        <span class="badge badge-primary badge-pill">
          {{ calculateProgress(character.stars) }}
        </span>
      </router-link>

      <a href="#"
         class="list-group-item list-group-item-action list-group-item-light
                d-flex align-items-center">
        <i class="icon-plus mr-2" aria-hidden="true"></i>Add a character
      </a>
    </div>

    <ul v-else class="list-group">
      <li class="list-group-item disabled">
        You do not have any characters yet.
      </li>
    </ul>
  </div>
</template>

<script src="./overview-page.ts"></script>
