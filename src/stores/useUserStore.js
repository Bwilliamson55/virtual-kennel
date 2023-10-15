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
    kennelIds: [],
    loading: false,
  }),
  actions: {
    setupAuthWatcher() {
      watchEffect(() => {
        try {
          if (
            this.authToken &&
            this.authExpires > new Date(Date.now()).toISOString()
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
    async signUp({ email, phoneNumber, notifyPref }) {
      try {
        const response = await n8n
          .post(constants.signupPost, {
            email,
            phoneNumber,
            notifyPref,
          })
          .catch((error) => {
            return error.response;
          });

        const data = response.data;
        this.code = response.status;
        if (response.status === 200) {
          this.message = JSON.stringify(data.message);
        } else {
          this.message =
            JSON.stringify(data) || "Error occurred during sign-up";
        }
      } catch (error) {
        this.code = 500;
        this.message = `Network error: ${error}, please try again`;
      }
    },
    async signIn({ email }) {
      try {
        const response = await n8n
          .post(constants.loginPost, {
            email,
          })
          .catch((error) => {
            return error.response;
          });

        const data = response.data;
        this.code = response.status;
        if (response.status === 200) {
          this.message = JSON.stringify(data.message);
        } else {
          this.message =
            JSON.stringify(data) || "Error occurred during sign-in";
        }
      } catch (error) {
        this.code = 500;
        this.message = `Network error: ${error}, please try again`;
      }
    },
    async confirmSignInCode(code) {
      let email = this.email;
      try {
        const response = await n8n
          .post(constants.confirmPost, {
            email,
            code,
          })
          .catch((error) => {
            return error.response;
          });

        const data = response.data;
        this.code = response.status;
        if (response.status === 200) {
          this.message = "Lovely!";
          this.authToken = data.auth_token ?? "";
          this.authExpires = data.expires_at ?? "";
          this.router.push("/dashboard");
        } else {
          this.message =
            JSON.stringify(data) || "Error occurred during sign-up";
        }
      } catch (error) {
        this.code = 500;
        this.message = `Network error: ${error}, please try again`;
      }
    },
    async signOut() {
      this.authToken = "";
      this.authExpires = "";
      this.router.push("/login");
    },
    async search(query) {
      try {
        const response = await n8n
          .get(constants.search, {
            params: {
              q: query,
            },
          })
          .catch((error) => {
            return error.response;
          });
        const data = this.ensureArray(response.data);
        this.code = response.status;
        if (response.status === 200) {
          this.results = data.filter((r) => !!r?.id) ?? [];
        } else {
          this.message = JSON.stringify(data) || "Error occurred during search";
        }
      } catch (error) {
        this.code = 500;
        this.message = `Network error: ${error}, please try again`;
      }
    },
    async fetchResults(term) {
      this.loading = true;
      await this.search(term);
      this.loading = false;
    },
    async addToKennel(houndId) {
      try {
        this.loading = true;
        const response = await n8n
          .post(constants.addToKennel, {
            houndId,
          })
          .catch((error) => {
            return error.response;
          });
        const data = response.data;
        this.code = response.status;
        if (response.status === 200) {
          this.message = JSON.stringify(data.message);
          this.getKennelIds();
        } else {
          this.message =
            JSON.stringify(data) || "Error occurred during add to kennel";
        }
      } catch (error) {
        this.code = 500;
        this.message = `Network error: ${error}, please try again`;
      } finally {
        this.loading = false;
      }
    },
    async removeFromKennel(houndId) {
      try {
        this.loading = true;
        const response = await n8n
          .post(constants.removeFromKennel, {
            houndId,
          })
          .catch((error) => {
            return error.response;
          });
        const data = response.data;
        this.code = response.status;
        if (response.status === 200) {
          this.message = JSON.stringify(data.message);
          this.getKennelIds();
        } else {
          this.message =
            JSON.stringify(data) || "Error occurred during remove from kennel";
        }
      } catch (error) {
        this.code = 500;
        this.message = `Network error: ${error}, please try again`;
      } finally {
        this.loading = false;
      }
    },
    async getKennelIds() {
      try {
        const response = await n8n
          .get(constants.getKennelIds)
          .catch((error) => {
            return error.response;
          });
        const data = response.data;
        this.code = response.status;
        if (response.status === 200) {
          this.kennelIds = data?.kennel ?? [];
        } else {
          this.message =
            JSON.stringify(data) || "Error occurred during get kennel";
        }
      } catch (error) {
        this.code = 500;
        this.message = `Network error: ${error}, please try again`;
      }
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
