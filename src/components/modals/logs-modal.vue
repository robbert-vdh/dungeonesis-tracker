<template>
  <b-modal id="logs-modal" title="Logs" @show="fetchLogs"
           :ok-only="true" ok-title="Got it">
    Logs!
  </b-modal>
</template>

<script src="./logs-modal.ts"></script>
