<template>
  <div>
    <div class="list-group">
      <template v-if="characters.length > 0">
        <router-link v-for="character in charactersWithoutActive"
                     :key="character.id"
                     :to="{ name: 'detail', params: { id: character.id } }"
                     class="list-group-item list-group-item-action d-flex
                            justify-content-between align-items-center">
          {{ character.name }}
          <span class="badge badge-pill ml-2"
                :class="{'badge-secondary': character.dead, 'badge-primary': !character.dead,
                         'badge-danger': character.iron_man && !character.dead}">
            {{ formatProgress(character) }}
          </span>
        </router-link>
      </template>

      <div v-else class="list-group-item disabled">
        You do not have any characters yet.
      </div>

      <button v-b-modal.character-add-modal type="button"
              class="list-group-item list-group-item-action list-group-item-light
                     d-flex align-items-center">
        <i class="icon-plus mr-2" aria-hidden="true"></i>Add a character
      </button>
    </div>
  </div>
</template>

<script src="./character-list.ts"></script>
