import { defineStore } from "pinia";
import { useUserApi } from "src/composables/useUserApi";
import { useNotification } from "src/composables/useNotification";
const { showSuccess, showError } = useNotification();
const userApi = useUserApi();

/**
 * Example user object:
{
	"id": "0bc7b36a-9ba9-4ce0-83f0-0a526f354e07",
	"first_name": "Admin",
	"last_name": "User",
	"email": "admin@example.com",
	"password": "**********",
	"location": "New York City",
	"title": "CTO",
	"description": null,
	"tags": null,
	"avatar": null,
	"language": "en-US",
	"appearance": "auto",
	"tfa_secret": null,
	"status": "active",
	"role": "653925a9-970e-487a-bfc0-ab6c96affcdc",
	"token": null,
	"last_access": "2021-02-05T10:18:13-05:00",
	"last_page": "/settings/roles/653925a9-970e-487a-bfc0-ab6c96affcdc"
}
 */
export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: null,
    users: [],
  }),
  actions: {
    async checkAndFetchCurrentUser() {
      if (!this.currentUser) {
        await this.fetchCurrentUser();
      }
    },

    async fetchCurrentUser() {
      try {
        const userData = await userApi.getCurrentUser();
        this.currentUser = userData;
        showSuccess("User data loaded");
      } catch (error) {
        showError("Error loading user data: " + error.message);
      }
    },

    async fetchUsers() {
      try {
        const usersData = await userApi.listUsers();
        this.users = usersData;
        showSuccess("User data loaded");
      } catch (error) {
        showError("Error loading user data: " + error.message);
      }
    },

    async updateUser(id, data) {
      try {
        await userApi.updateUser(id, data);
        // TODO: Update local users data
        showSuccess("User updated? TODO");
      } catch (error) {
        // Handle error
      }
    },

    async updateCurrentUser(data) {
      try {
        await userApi.updateCurrentUser(data);
        this.fetchCurrentUser(); // Refresh current user data
        showSuccess("User updated successfully");
      } catch (error) {
        showError("Error updating user: " + error.message);
      }
    },

    async createUser(data) {
      try {
        await userApi.createUser(data);
        // TODO
        showSuccess("User created? TODO");
      } catch (error) {
        // Handle error
      }
    },

    async inviteUser(email, role, invite_url) {
      try {
        await userApi.inviteUser(email, role, invite_url);
        // TODO
        showSuccess("User invited? TODO");
      } catch (error) {
        // Handle error
      }
    },

    async acceptInvite(token, password) {
      try {
        await userApi.acceptInvite(token, password);
        // TODO
        showSuccess("User accepted invite? TODO");
      } catch (error) {
        // Handle error
      }
    },
  },
  persist: true,
});
