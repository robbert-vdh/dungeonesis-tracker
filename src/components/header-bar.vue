<template>
  <div class="row align-items-end justify-content-between mb-3">
    <slot>
      <span class="col lead mt-3 mt-md-0 order-2 order-md-1">
        Welcome back, {{ user.first_name }}
      </span>
    </slot>

    <div class="btn-group btn-group-sm col-md-auto order-1 order-md-2" role="group">
      <!-- TODO: Add a help page -->
      <b-dropdown id="about-dropdown" text="About" variant="info" size="sm"
                  :no-caret="true" class="flex-fill">
        <b-dropdown-item-button v-b-modal.logs-modal>
          View logs
        </b-dropdown-item-button>
        <b-dropdown-item-button v-b-modal.changelog-modal>
          Changelog
        </b-dropdown-item-button>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-text tag="small" style="min-width: 11rem">
          Updated for patch 7.1
        </b-dropdown-text>
      </b-dropdown>
      <a class="btn btn-secondary" href="/logout">
        Log out
      </a>
    </div>
  </div>
</template>

<script src="./header-bar.ts"></script>
