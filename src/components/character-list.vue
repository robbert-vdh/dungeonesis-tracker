<template>
  <div>
    <div class="list-group">
      <template v-if="characters.length > 0">
        <router-link v-for="character in characters"
                     :key="character.id"
                     :to="{ name: 'detail', params: { id: character.id } }"
                     class="list-group-item list-group-item-action d-flex
                           justify-content-between align-items-center">
          {{ character.name }}
          <span class="badge badge-primary badge-pill ml-2">
            {{ formatProgress(character.stars) }}
          </span>
        </router-link>
      </template>

      <li v-else class="list-group-item disabled">
        You do not have any characters yet.
      </li>

      <button v-b-modal.character-add-modal type="button"
              class="list-group-item list-group-item-action list-group-item-light
                     d-flex align-items-center">
        <i class="icon-plus mr-2" aria-hidden="true"></i>Add a character
      </button>
    </div>
  </div>
</template>

<script src="./character-list.ts"></script>
