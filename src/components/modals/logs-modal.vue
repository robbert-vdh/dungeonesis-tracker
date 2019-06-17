<template>
  <b-modal id="logs-modal" title="Logs" @show="fetchLogs"
           :ok-only="true" ok-title="Got it" size="lg">
    <!-- TODO: Add a spinner for while the logs are still loading -->
    <!-- TODO: Maybe remove the parts in parentheses from the reasons -->
    <!-- The formatting of these messages could be done externally but I feel -->
    <!-- like they're small enough to be done inline -->
    <table class="table">
      <tbody>
        <tr v-for="log in logs" :key="log.id">
          <td class="font-weight-light" style="width: 1px; white-space: nowrap">
            {{ formatDate(log.created_at) }}
          </td>
          <td v-if="log.type === 'LogType.STARS_SPENT'">
            <span class="text-secondary">
              {{ Math.abs(log.value.amount) }}
            </span>

            {{ Math.abs(log.value.amount) === 1 ? 'star' : 'stars' }}
            {{ log.value.amount >= 0
                ? (log.value.reason !== null ? 'added to' : 'spent on')
                : 'refunded from' }}
            <span v-if="log.character === null" class="font-weight-bold text-secondary">
              &lt;REDACTED&gt;
            </span>
            <span v-else class="text-secondary">{{ characterName(log.character) }}</span>

            <span v-if="log.value.reason !== null">({{ log.value.reason }})</span>
          </td>
          <td v-else-if="log.type === 'LogType.STARS_ADDED'">
            <span class="text-secondary">
              {{ Math.abs(log.value.amount) }}
            </span>

            {{ Math.abs(log.value.amount) === 1 ? 'star' : 'stars' }}
            {{ log.value.amount >= 0 ? 'added to' : 'removed from' }}
            the pool

            <span v-if="log.value.reason !== null">({{ log.value.reason }})</span>
          </td>
          <td v-else-if="log.type === 'LogType.CHARACTER_ADDED'">
            Added

            <span class="text-secondary">
              {{ log.value.name }}
            </span>

            at level

            <span class="text-secondary">
              {{ calculateLevel(log.value.stars) }}
            </span>
          </td>
          <td v-else-if="log.type === 'LogType.CHARACTER_DELETED'">
            Removed

            <span class="text-secondary">
              {{ log.value.name }}
            </span>

            at level

            <span class="text-secondary">
              {{ calculateLevel(log.value.stars) }}
            </span>

            with

            <span class="text-secondary">
              {{ log.value.stars }}
            </span>

            total stars
          </td>
        </tr>
      </tbody>
    </table>
  </b-modal>
</template>

<script src="./logs-modal.ts"></script>

<style lang="scss">
 // Bootstrap assumes there is a <thead>
 tr:first-child > td {
   border-top: 0;
 }
</style>
