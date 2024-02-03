import { defineStore } from "pinia";
import { useAuthApi } from "src/composables/useAuthApi";
const authApi = useAuthApi();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    expires: null,
    refreshCount: 0,
  }),
  getters: {
    isAuthenticated: (state) => {
      return !!state.accessToken && new Date() < new Date(state.expires);
    },
    currentToken: (state) => {
      return state.accessToken;
    },
  },
  actions: {
    async login(email, password, otp, mode) {
      try {
        const response = await authApi.login(email, password);
        this.user = response.auth_login;
        this.accessToken = response.auth_login.access_token;
        this.refreshToken = response.auth_login.refresh_token;
        const expiresInMilliseconds = parseInt(response.auth_login.expires, 10);
        const currentTime = new Date().getTime();
        this.expires = currentTime + expiresInMilliseconds;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async refreshTokenAction() {
      try {
        if (!this.refreshToken) {
          throw new Error("No refresh token available.");
        }
        const response = await authApi.refreshToken(this.refreshToken);
        this.accessToken = response.auth_refresh.access_token;
        this.refreshToken = response.auth_refresh.refresh_token;
        const expiresInMilliseconds = parseInt(
          response.auth_refresh?.expires ?? 450000, // 7.5 minutes
          10
        );
        const currentTime = new Date().getTime();
        this.expires = currentTime + expiresInMilliseconds;
        this.refreshCount++;
      } catch (error) {
        this.logout(); // If refresh fails, log out
        throw error;
      }
    },

    async logout() {
      try {
        if (this.refreshToken) {
          await authApi.logout(this.refreshToken);
        }
      } finally {
        this.user = null;
        this.accessToken = null;
        this.refreshToken = null;
        this.expires = null;
      }
    },

    async checkTokenValidity() {
      const currentTime = new Date().getTime();
      if (this.expires && currentTime > this.expires) {
        this.logout();
        return false; // Automatically log out if the token is expired
      }
      // if the token expires within 5 minutes, refresh it or try to
      if (this.expires && currentTime > this.expires - 5 * 60 * 1000) {
        await this.refreshTokenAction();
        return true;
      }
      return null;
    },

    async requestPasswordReset(email, reset_url) {
      try {
        await authApi.resetPassword(email, reset_url);
      } catch (error) {
        return error;
      }
    },

    async setPassword(token, password) {
      try {
        await authApi.setPassword(token, password);
      } catch (error) {
        return error;
      }
    },
  },
  persist: true,
});
