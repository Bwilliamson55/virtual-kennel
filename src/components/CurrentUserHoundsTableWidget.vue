<template>
  <q-card class="q-ma-md">
    <q-toolbar>
      <span class="text-h6">Your Hounds</span>
      <q-space />
      <q-btn
        flat
        round
        dense
        icon="refresh"
        @click="updateHounds"
        aria-label="Refresh Hounds"
      />
    </q-toolbar>
    <q-table
      title="Hounds"
      :rows="hounds"
      :columns="columns"
      row-key="id"
      virtual-scroll
      v-model:pagination="houndsStore.pagination"
      :filter="filterQuery"
      :loading="loading"
      @update:pagination="updateHounds"
      @request="onRequest"
      style="max-width: 90vw"
    >
      <template #top>
        <q-input
          v-model="filterQuery"
          placeholder="Search hounds..."
          debounce="300"
          @update:model-value="updateHounds"
        />
      </template>
      <template #body="props">
        <template v-if="loading">
          <q-tr v-for="n in 10" :key="n">
            <q-td colspan="100%">
              <q-skeleton type="rect" height="50px" />
            </q-td>
          </q-tr>
        </template>
        <template v-else>
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name === 'url'">
                <q-btn dense flat size="md" :href="col.value" target="_blank">
                  <q-icon name="open_in_new" />
                </q-btn>
              </template>
              <template v-else>
                {{ col.value }}
              </template>
            </q-td>
          </q-tr>
        </template>
      </template>
    </q-table>
  </q-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useHoundsStore } from "src/stores/hounds";

const houndsStore = useHoundsStore();
const hounds = ref([]);
const loading = ref(false);

const columns = [
  { name: "name", label: "Name", field: "name", sortable: true },
  {
    name: "whelp_date",
    label: "Whelp Date",
    field: "whelp_date",
    sortable: true
  },
  { name: "color", label: "Color", field: "color", sortable: true },
  { name: "sex", label: "Sex", field: "sex", sortable: true },
  { name: "url", label: "URL", field: "url", sortable: true },
  {
    name: "left_tattoo",
    label: "Left Tattoo",
    field: "left_tattoo",
    sortable: true
  },
  {
    name: "right_tattoo",
    label: "Right Tattoo",
    field: "right_tattoo",
    sortable: true
  },
  { name: "damn", label: "Damn", field: "damn", sortable: true },
  { name: "sire", label: "Sire", field: "sire", sortable: true },
  { name: "id", label: "ID", field: "id", sortable: true }
];

const filterQuery = ref("");
const filter = computed(() => {
  let filter = {};
  if (filterQuery.value) {
    filter = {
      _or: columns.map((col) => ({
        [col.field]: { _ilike: `%${filterQuery.value}%` }
      }))
    };
  }
  return filter;
});

const updateHounds = () => {
  loading.value = true;
  houndsStore
    .fetchCurrentUserHounds({
      filter: {}, // removing for now
      sort: [],
      limit: -1,
      offset: 0
    })
    .then(() => {
      hounds.value = houndsStore.currentUserHounds;
      loading.value = false;
    });
};

const onRequest = (props) => {
  houndsStore.pagination = props.pagination;
  updateHounds();
};

onMounted(() => {
  updateHounds();
});
</script>
