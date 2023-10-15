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
    <div class="overview q-ma-md">
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
    <div class="visualization">
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
              <q-tab name="list" label="List" />
              <q-tab name="grid" label="Grid" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel class="q-pa-xs-none q-pa-sm-md" name="list">
                <div class="text-center q-ma-xs text-h6">Hound List</div>
                <search-component />
              </q-tab-panel>

              <q-tab-panel name="grid">
                <div class="text-h6">Hounds Grid</div>
                <div class="q-pa-md">
                  <q-markup-table>
                    <thead>
                      <tr>
                        <th class="text-left" style="width: 150px">
                          <q-skeleton animation="blink" type="text" />
                        </th>
                        <th class="text-right">
                          <q-skeleton animation="blink" type="text" />
                        </th>
                        <th class="text-right">
                          <q-skeleton animation="blink" type="text" />
                        </th>
                        <th class="text-right">
                          <q-skeleton animation="blink" type="text" />
                        </th>
                        <th class="text-right">
                          <q-skeleton animation="blink" type="text" />
                        </th>
                        <th class="text-right">
                          <q-skeleton animation="blink" type="text" />
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="n in 5" :key="n">
                        <td class="text-left">
                          <q-skeleton
                            animation="blink"
                            type="text"
                            width="85px"
                          />
                        </td>
                        <td class="text-right">
                          <q-skeleton
                            animation="blink"
                            type="text"
                            width="50px"
                          />
                        </td>
                        <td class="text-right">
                          <q-skeleton
                            animation="blink"
                            type="text"
                            width="35px"
                          />
                        </td>
                        <td class="text-right">
                          <q-skeleton
                            animation="blink"
                            type="text"
                            width="65px"
                          />
                        </td>
                        <td class="text-right">
                          <q-skeleton
                            animation="blink"
                            type="text"
                            width="25px"
                          />
                        </td>
                        <td class="text-right">
                          <q-skeleton
                            animation="blink"
                            type="text"
                            width="85px"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, toRefs } from "vue";
import { useUserStore } from "../stores/useUserStore";
import { useRouter } from "vue-router";
import SearchComponent from "src/components/SearchComponent.vue";

const userStore = useUserStore();
const { message, email, authToken } = toRefs(userStore);
const search = ref("");
const router = useRouter();
const tab = ref("list");

const goToManageKennel = () => {
  router.push("/manage-kennel");
};
</script>

<style scoped>
/* Add CSS styles for your dashboard layout and components here */
</style>
