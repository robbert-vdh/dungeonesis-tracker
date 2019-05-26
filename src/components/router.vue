<template>
  <div id="app">
    <transition name="instant-fade" mode="out-in">
      <div v-if="hasLoaded" key="loaded">
        <div class="row align-items-end mb-3">
          <!-- TODO: Replace this with a character drop down when not on the overview page. -->
          <span class="col lead">
            Welcome back, {{ user.first_name }}
          </span>

          <div class="btn-group btn-group-sm col-md-auto" role="group">
            <!-- TODO: Add a help page -->
            <button type="button" class="btn btn-info">Help</button>
            <a class="btn btn-secondary" href="/logout">
              Log out
            </a>
          </div>
        </div>

        <router-view></router-view>
      </div>

      <div v-else key="loading" class="spinner-grow m-3" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </transition>
  </div>
</template>

<script src="./router.ts"></script>
