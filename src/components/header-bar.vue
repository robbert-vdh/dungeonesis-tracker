<template>
  <div class="row align-items-end justify-content-between mb-3">
    <slot>
      <span class="col lead mt-3 mt-md-0 order-2 order-md-1">
        Welcome back, {{ user.first_name }}
      </span>
    </slot>

    <div class="btn-group btn-group-sm col-md-auto order-1 order-md-2" role="group">
      <!-- TODO: Add a help page -->
      <button v-b-popover.hover.bottom.html="`
                <p>Just click on stuff and hope for the best.</p>
                <p>The reward for completing a quest depends on the currently selected character.</p>
                `"
              title="Updated for patch 5.4" type="button" class="btn btn-info">
        Help
      </button>
      <a class="btn btn-secondary" href="/logout">
        Log out
      </a>
    </div>
  </div>
</template>

<script src="./header-bar.ts"></script>
