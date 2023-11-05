import { watchEffect } from "vue";
import { defineStore } from "pinia";
import { constants } from "./constants";
import { n8n } from "../boot/axios";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    user: null,
    email: "",
    code: null,
    message: "",
    confirmCode: "",
    authToken: "",
    authExpires: "",
    isAuthenticated: false,
    results: [],
    myResults: [],
    kennelIds: [],
    loading: false,
  }),
  actions: {
    setupAuthWatcher() {
      watchEffect(() => {
        try {
          if (
            this.authToken &&
            this.authExpires > new Date(Date.now()).toISOString() &&
            this.authTokenCheck(this.authToken)
          ) {
            n8n.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${this.authToken}`;
            console.log("Auth token set and expires at " + this.authExpires);
            this.isAuthenticated = true;
          } else {
            this.isAuthenticated = false;
          }
        } catch (error) {
          console.log(error);
          this.isAuthenticated = false;
        }
      });
    },
    async makeRequest({ method, endpoint, payload, onSuccess, onError }) {
      this.loading = true;
      try {
        const response = await n8n[method](endpoint, payload).catch((error) => {
          throw error.response;
        });
        if (response.status === 200 && onSuccess) {
          onSuccess(response.data);
        } else if (onError) {
          onError(response);
        }
        this.code = response.status;
      } catch (error) {
        this.code = error.status || 500;
        this.message = `Network error: ${error.statusText}, please try again`;
        if (onError) {
          onError(error);
        }
      } finally {
        this.loading = false;
      }
    },
    async authTokenCheck(token) {
      try {
        const response = await n8n
          .post(constants.confirmAuth, {
            token,
          })
          .catch((error) => {
            return error.response;
          });
        if (response.status === 200) {
          this.user = response.data?.user_id ?? null;
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },
    async signUp(payload) {
      await this.makeRequest({
        method: "post",
        endpoint: constants.signupPost,
        payload,
        onSuccess: (data) => {
          this.message = JSON.stringify(data.message);
        },
        onError: (response) => {
          this.message =
            JSON.stringify(response.data) || "Error occurred during sign-up";
        },
      });
    },
    async signIn(payload) {
      await this.makeRequest({
        method: "post",
        endpoint: constants.loginPost,
        payload,
        onSuccess: (data) => {
          this.message = JSON.stringify(data.message);
        },
        onError: (response) => {
          this.message =
            JSON.stringify(response.data) || "Error occurred during sign-in";
        },
      });
    },
    async confirmSignInCode(payload) {
      let email = this.email;
      payload = { email, code: payload };
      await this.makeRequest({
        method: "post",
        endpoint: constants.confirmPost,
        payload,
        onSuccess: (data) => {
          this.message = "Signed in successfully";
          this.authToken = data.auth_token;
          this.authExpires = data.expires_at;
          this.router.push("/dashboard");
        },
        onError: (response) => {
          this.message =
            JSON.stringify(response.data) ||
            "Error occurred during code confirmation";
        },
      });
    },
    async signOut() {
      this.authToken = "";
      this.authExpires = "";
      this.router.push("/login");
    },
    async search(payload, mine = false) {
      let endpoint = constants.search;
      if (mine && this.isAuthenticated && this.user) {
        payload = {
          params: {
            q: payload,
            user: this.user,
          },
        };
        endpoint = constants.getUserKennel;
      } else {
        payload = {
          params: {
            q: payload,
          },
        };
      }
      await this.makeRequest({
        method: "get",
        endpoint: endpoint,
        payload: payload,
        onSuccess: (data) => {
          if (mine) {
            this.myResults = this.ensureArray(data).filter((r) => r?.id);
          } else {
            this.results = this.ensureArray(data).filter((r) => r?.id);
          }
        },
        onError: (response) => {
          this.message =
            JSON.stringify(response.data) || "Error occurred during search";
        },
      });
    },
    async fetchResults(term, mine = false) {
      this.loading = true;
      await this.search(term, mine);
      this.loading = false;
    },
    async addToKennel(payload) {
      payload = { houndId: payload };
      await this.makeRequest({
        method: "post",
        endpoint: constants.addToKennel,
        payload,
        onSuccess: (data) => {
          this.message = JSON.stringify(data.message);
          this.getKennelIds();
        },
        onError: (response) => {
          this.message =
            JSON.stringify(response.data) ||
            "Error occurred during add to kennel";
        },
      });
    },
    async removeFromKennel(payload) {
      payload = { houndId: payload };
      await this.makeRequest({
        method: "post",
        endpoint: constants.removeFromKennel,
        payload,
        onSuccess: (data) => {
          this.message = JSON.stringify(data.message);
          this.getKennelIds();
        },
        onError: (response) => {
          this.message =
            JSON.stringify(response.data) ||
            "Error occurred during remove from kennel";
        },
      });
    },
    async getKennelIds() {
      await this.makeRequest({
        method: "get",
        endpoint: constants.getKennelIds,
        payload: {},
        onSuccess: (data) => {
          this.kennelIds = data.kennel || [];
        },
        onError: (response) => {
          this.message =
            JSON.stringify(response.data) ||
            "Error occurred during get kennel IDs";
        },
      });
    },
    async getKennel() {
      await this.makeRequest({
        method: "get",
        endpoint: constants.getUserKennel,
        payload: {},
        onSuccess: (data) => {
          this.results = data.kennel || [];
        },
        onError: (response) => {
          this.message =
            JSON.stringify(response.data) || "Error occurred during get kennel";
        },
      });
    },
    ensureArray(obj) {
      if (Array.isArray(obj)) {
        return obj;
      }
      return [obj];
    },
  },
  persist: true,
});
