<template>
  <q-page class="flex flex-top q-pa-md column items-center">
    <h1>WAT</h1>
    <q-input
      debounce="500"
      v-model="searchTerm"
      :loading="loading"
      placeholder="Search for a dog..."
      style="min-width: 300px"
    >
      <template v-if="loading" #loading>
        <div class="q-mx-sm">
          <q-spinner-pie color="light-primary" />
        </div>
      </template>
    </q-input>
    <div class="results q-ma-sm full-width column items-center">
      <div v-if="!results || results.length === 0" class="row">
        <q-item v-for="i in 5" :key="i" class="full-width">
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" :width="skeleWidths[i]" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <q-item v-for="result in results" :key="result.id" class="full-width">
        <q-item-section avatar>
          <q-avatar>
            <q-btn
              @click="openURL(result.url ?? '#')"
              dense
              round
              color="primary"
              class="q-mx-md"
              >{{ result.id }}</q-btn
            >
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ result.name }}</q-item-label>
          <q-item-label class="text-italic" caption> sire x dam </q-item-label>
          <q-item-label caption>
            {{ result.sire }} x {{ result.dam }}
          </q-item-label>
          <q-item-label caption>
            {{ result.starts }}
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <template v-if="result.left_tattoo">
            <q-item-label caption>
              <span class="text-italic">Left Tattoo: </span>
              {{ result.left_tattoo }}
            </q-item-label>
          </template>
          <template v-if="result.right_tattoo">
            <q-item-label caption>
              <span class="text-italic">Right Tattoo: </span>
              {{ result.right_tattoo }}
            </q-item-label>
          </template>
          <template v-if="result.sex">
            <q-item-label caption>
              <span class="text-italic">Sex: </span>
              {{ result.sex }}
            </q-item-label>
          </template>
          <template v-if="result.color">
            <q-item-label caption>
              <span class="text-italic">Color: </span>
              {{ result.color }}
            </q-item-label>
          </template>
          <template v-if="result.whelp_date">
            <q-item-label caption>
              <span class="text-italic">Birth Date: </span>
              {{ result.whelp_date.slice(0, 10) }}
            </q-item-label>
          </template>
        </q-item-section>
        <q-item-section side>
          <template v-if="result.next_race_date">
            <q-item-label caption>
              <span class="text-italic">Next Race </span>
              <q-icon name="calendar_today" />
            </q-item-label>
            <q-item-label caption>
              {{ result.next_race_date }}
            </q-item-label>
          </template>
        </q-item-section>
      </q-item>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, toRefs, computed } from "vue";
import { useUserStore } from "src/stores/useUserStore";
import { debounce, openURL } from "quasar";

const userStore = useUserStore();
const { results } = toRefs(userStore);
const loading = ref(false);
const searchTerm = ref("");
const skeleWidths = ["35%", "65%", "90%", "75%", "50%"];

const fetchResults = async () => {
  loading.value = true;
  await userStore.search(searchTerm.value);
  loading.value = false;
};
watch(searchTerm, fetchResults);
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 1em;
}
</style>
