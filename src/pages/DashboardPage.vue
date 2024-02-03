<template>
  <q-page class="flex flex-center">
    <div class="row">
      <profile-widget />
      <current-user-hounds-table-widget-vue />
    </div>
    <div class="row">
      <hounds-table-widget />
    </div>
  </q-page>
</template>

<script setup>
import ProfileWidget from "src/components/ProfileWidget.vue";
import HoundsTableWidget from "src/components/HoundsTableWidget.vue";
import CurrentUserHoundsTableWidgetVue from "src/components/CurrentUserHoundsTableWidget.vue";
</script>
