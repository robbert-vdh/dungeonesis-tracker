<template>
  <b-modal ref="modal" @show="reset" @ok.prevent="submit"
           :ok-disabled="stars < 0 || delta === 0" id="star-adjust-modal"
           title="Manually add or remove stars">
    <form ref="form" @submit.stop.prevent="submit" class="mb-3"
          :class="{ 'was-validated': wasSubmitted }" novalidate>
      <div class="form-group">
        <label for="stars-adjust-stars">Stars</label>
        <input v-model="stars" type="number" class="form-control"
               id="stars-adjust-stars" min="0" required>
      </div>
      <div class="form-group">
        <label for="stars-adjust-reason">Reason (optional)</label>
        <input v-model="reason" type="text" class="form-control"
               id="stars-adjust-reason">
      </div>
    </form>

    <p v-if="delta >= 0">
      Adding {{ delta }} stars
    </p>
    <p v-else>
      Removing {{ -delta }} stars
    </p>
  </b-modal>
</template>

<script src="./star-adjust-modal.ts"></script>
