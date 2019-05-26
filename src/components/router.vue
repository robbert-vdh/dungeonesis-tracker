<template>
  <div id="app">
    <transition name="instant-fade" mode="out-in">
      <router-view v-if="hasLoaded"></router-view>

      <p v-else>Loading...</p>
    </transition>
  </div>
</template>

<script src="./router.ts"></script>
