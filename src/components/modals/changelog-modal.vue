<template>
  <b-modal id="changelog-modal" title="Changelog" :ok-only="true" :visible="startVisible">
    <div v-html="contents" class="changelog"></div>
  </b-modal>
</template>

<script src="./changelog-modal.ts"></script>

<style lang="scss">
 .changelog {
   h2 {
     font-size: 1.5rem;
     margin-top: 1.0rem;

     &:first-child {
       margin-top: 0;
     }
   }

   h3 {
     font-size: 1.2rem;
     font-weight: 600;
   }

   ul {
     margin-bottom: 0.25rem;
   }
 }
</style>
