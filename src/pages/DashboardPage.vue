<template>
  <q-page class="q-pa-md">
    <!-- Header  -->
    <div class="header q-ma-md">
      <div class="user-info">Hello {{ email }}!</div>
      <q-btn
        class="hidden"
        label="Manage Kennel"
        @click="goToManageKennel"
        color="primary"
      />
    </div>

    <!-- Overview  -->
    <div class="overview q-ma-md" hidden>
      <q-card style="max-width: 300px">
        <q-card-section>
          <div class="text-caption">Your Overview will be here</div>
        </q-card-section>
        <q-item>
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-skeleton height="200px" square />

        <q-card-actions align="center" class="q-pa-xs">
          <q-skeleton type="QBtn" class="q-mr-sm" />
          <q-skeleton type="QBtn" />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Visualization  -->
    <div class="visualization" hidden>
      <q-card class="q-ma-md q-pa-md">
        <div class="text-caption">Some visualizations here</div>
        <q-skeleton class="bg-accent" type="circle" />
        <q-skeleton class="bg-secondary" />
        <q-skeleton class="bg-primary" animation="pulse-y" />
        <q-skeleton class="bg-dark" animation="pulse-x" />
      </q-card>
    </div>

    <!-- Hounds List -->
    <div class="hounds-list">
      <!-- Display list or cards of hounds -->
      <div class="q-ma-sm">
        <div class="text-caption">Hounds Details/summary here</div>
        <div class="q-ma-xs">
          <q-card>
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="your-hounds" label="Your Hounds" />
              <q-tab name="search-hounds" label="Search Hounds" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel class="q-pa-xs-none q-pa-sm-md" name="your-hounds">
                <search-component mine />
              </q-tab-panel>

              <q-tab-panel name="search-hounds">
                <div class="text-center q-ma-xs text-h6">
                  Hounds in the database
                  <span class="text-caption">(25 at a time)</span>
                </div>
                <search-component />
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, toRefs } from "vue";
import { useUserStore } from "../stores/useUserStore";
import { useRouter } from "vue-router";
import SearchComponent from "src/components/SearchComponent.vue";

const userStore = useUserStore();
const { message, email, kennelIds } = toRefs(userStore);
const search = ref("");
const router = useRouter();
const tab = ref("your-hounds");

const goToManageKennel = () => {
  router.push("/manage-kennel");
};

onMounted(() => {
  if (!kennelIds.value.length) {
    userStore.getKennelIds();
  }
});
</script>

<style scoped>
/* Add CSS styles for your dashboard layout and components here */
</style>
