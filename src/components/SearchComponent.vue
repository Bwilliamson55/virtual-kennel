<template>
  <div class="flex flex-top column items-center">
    <q-input
      debounce="500"
      v-model="searchTerm"
      :loading="localLoading"
      placeholder="Search..."
      style="min-width: 250px"
      clearable
    >
      <template v-if="localLoading" #loading>
        <div class="q-mx-sm">
          <q-spinner-pie color="light-primary" />
        </div>
      </template>
    </q-input>
    <div class="results q-ma-xs-xs q-ma-sm-sm full-width column items-center">
      <div
        v-if="!localResults || localResults.length === 0"
        class="row full-width"
      >
        <q-list bordered separator class="full-width">
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
        </q-list>
      </div>
      <q-list bordered separator class="full-width">
        <q-item
          v-for="result in localResults"
          :key="result.id"
          class="full-width q-px-xs-xs q-px-sm-sm"
        >
          <q-item-section>
            <div class="q-py-xs q-px-md row">
              <span class="column">{{ result.name }}</span>
              <a
                v-if="result.url"
                :href="result.url ?? '#'"
                target="_blank"
                class="q-ml-xs-auto"
                >Track Info Link</a
              >
            </div>
            <q-item>
              <q-item-section>
                <div class="column q-pa-xs-xs q-pa-sm-sm">
                  <q-item-label caption>
                    <span
                      class="text-italic text-weight-medium column-xs flex-sm-inline"
                      >Sire:
                    </span>
                    {{ result.sire }}
                  </q-item-label>
                  <q-item-label caption>
                    <span
                      class="text-italic text-weight-medium column-xs flex-sm-inline"
                      >Dam:
                    </span>
                    {{ result.dam }}
                  </q-item-label>
                  <q-item-label caption>
                    <span
                      class="text-italic text-weight-medium column-xs flex-sm-inline"
                      >Starts:
                    </span>
                    {{ result.starts }}
                  </q-item-label>
                </div>
              </q-item-section>
              <q-item-section>
                <div class="q-pa-xs-xs q-pa-sm-sm">
                  <template v-if="result.left_tattoo">
                    <q-item-label caption>
                      <span class="text-italic text-weight-medium"
                        >Left Tattoo:
                      </span>
                      {{ result.left_tattoo }}
                    </q-item-label>
                  </template>
                  <template v-if="result.right_tattoo">
                    <q-item-label caption>
                      <span class="text-italic text-weight-medium"
                        >Right Tattoo:
                      </span>
                      {{ result.right_tattoo }}
                    </q-item-label>
                  </template>
                  <template v-if="result.sex">
                    <q-item-label caption>
                      <span class="text-italic text-weight-medium">Sex: </span>
                      {{ result.sex }}
                    </q-item-label>
                  </template>
                  <template v-if="result.color">
                    <q-item-label caption>
                      <span class="text-italic text-weight-medium"
                        >Color:
                      </span>
                      {{ result.color }}
                    </q-item-label>
                  </template>
                  <template v-if="result.whelp_date">
                    <q-item-label caption>
                      <span class="text-italic text-weight-medium"
                        >Birth Date:
                      </span>
                      {{ result.whelp_date.slice(0, 10) }}
                    </q-item-label>
                  </template>
                  <template v-if="result.next_race_date">
                    <q-item-label caption>
                      <span class="text-italic">Next Race </span>
                      <q-icon name="calendar_today" />
                    </q-item-label>
                    <q-item-label caption>
                      {{ result.next_race_date }}
                    </q-item-label>
                  </template>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                <q-btn
                  :color="!isInKennel(result.id) ? 'primary' : 'green'"
                  :disable="isInKennel(result.id)"
                  :label="
                    !isInKennel(result.id) ? 'Add to Kennel' : 'In Kennel'
                  "
                  :icon="!isInKennel(result.id) ? 'add' : 'check'"
                  :loading="localLoading"
                  @click="userStore.addToKennel(result.id)"
                />
              </q-item-section>
              <q-item-section>
                <q-btn
                  v-if="isInKennel(result.id)"
                  color="negative"
                  icon="delete"
                  class="q-ml-auto"
                  @click="openRemoveDialog(result.id)"
                />
              </q-item-section>
            </q-item>
          </q-item-section>
        </q-item>
      </q-list>
      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="pets" color="negative" text-color="white" />
            <span class="q-ml-sm"
              >Are you sure you want to remove this dog from your kennel?</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              label="Remove"
              color="negative"
              @click="removeFromKennel(selectedDogId)"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, toRefs, onMounted } from "vue";
import { useUserStore } from "src/stores/useUserStore";

const confirm = ref(false);
const selectedDogId = ref(null);
const skeleWidths = ["35%", "65%", "90%", "75%", "50%"];
const userStore = useUserStore();
const { results, myResults, loading, kennelIds } = toRefs(userStore);
const localResults = ref([]);
const props = defineProps({
  mine: {
    type: Boolean,
    default: false
  }
});

const searchTerm = ref("");
const localLoading = ref(loading);

const openRemoveDialog = (id) => {
  selectedDogId.value = id;
  confirm.value = true;
};
const removeFromKennel = (id) => {
  userStore.removeFromKennel(id);
  confirm.value = false;
};

const isInKennel = (id) => {
  return kennelIds.value.includes(id);
};
// Watch for searches and loading changes
watch(searchTerm, async () => {
  await userStore.fetchResults(searchTerm.value, props.mine);
  localResults.value = props.mine ? myResults.value : results.value;
});

onMounted(async () => {
  if (localResults.value.length === 0) {
    await userStore.fetchResults(searchTerm.value, props.mine);
  }
  localResults.value = props.mine ? myResults.value : results.value;
});
</script>
