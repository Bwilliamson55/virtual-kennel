import { defineStore } from "pinia";
import { useHoundsApi } from "src/composables/useHoundsApi";

export const useHoundsStore = defineStore("hounds", {
  state: () => ({
    hounds: [],
    currentUserHounds: [],
    hounds_aggregated: {},
    pagination: {
      sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    },
    // Add any additional state related to hounds
  }),
  actions: {
    async fetchHounds({ filter, sort, limit, offset, page, search }) {
      try {
        const { getHounds } = useHoundsApi();
        this.hounds = await getHounds({
          filter,
          sort,
          limit,
          offset,
          page,
          search,
        });
        if (this.hounds?.length && !this.hounds_aggregated?.count?.id) {
          this.fetchHoundsAggregated();
        }
      } catch (error) {
        console.error("Error fetching hounds:", error);
      }
    },
    async fetchHoundsAggregated() {
      try {
        const { getHoundsAggregated } = useHoundsApi();
        let response = await getHoundsAggregated();
        this.hounds_aggregated = response[0] || {};
        // if theres a count.id then use that as rowsNumber
        if (this.hounds_aggregated?.count?.id) {
          this.pagination.rowsNumber = this.hounds_aggregated.count.id;
        }
      } catch (error) {
        console.error("Error fetching hounds aggregated:", error);
      }
    },
    async fetchCurrentUserHounds({
      filter,
      sort,
      limit,
      offset,
      page,
      search,
    }) {
      try {
        const { getCurrentUserHounds } = useHoundsApi();
        let currentUserHounds = await getCurrentUserHounds({
          filter,
          sort,
          limit,
          offset,
          page,
          search,
        });
        this.currentUserHounds = currentUserHounds.map((h) => h.hound_id);
      } catch (error) {
        console.error("Error fetching current user hounds:", error);
      }
    },

    // Add more actions for other operations like creating, updating, etc.
  },
  persist: true,
});
