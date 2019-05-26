<template>
  <div id="app">
    <transition name="instant-fade" mode="out-in">
      <div v-if="hasLoaded">
        <p>Welcome back, {{ user.first_name }}</p>

        <router-view></router-view>
      </div>

      <span v-else>Loading...</span>
    </transition>
  </div>
</template>

<script src="./router.ts"></script>
