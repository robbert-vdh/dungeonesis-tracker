<template>
  <div id="app">
    <transition name="instant-fade" mode="out-in" :duration="15">
      <div v-if="hasLoaded" key="loaded">
        <transition name="fast-fade" mode="out-in">
          <router-view></router-view>
        </transition>

        <!-- We'll register our modals here so that we can use them throughout the application -->
        <character-add-modal></character-add-modal>
      </div>

      <div v-else key="loading" class="spinner-grow m-3" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </transition>
  </div>
</template>

<script src="./main.ts"></script>
