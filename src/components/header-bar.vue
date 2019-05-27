<template>
  <div class="row align-items-end justify-content-between mb-3">
    <slot>
      <span class="col lead">
        Welcome back, {{ user.first_name }}
      </span>
    </slot>

    <div class="btn-group btn-group-sm col-md-auto" role="group">
      <!-- TODO: Add a help page -->
      <button type="button" class="btn btn-info">Help</button>
      <a class="btn btn-secondary" href="/logout">
        Log out
      </a>
    </div>
  </div>
</template>

<script src="./header-bar.ts"></script>
