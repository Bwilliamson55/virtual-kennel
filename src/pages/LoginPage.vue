<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 90%; max-width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">Login</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleLogin" @reset="onReset">
          <q-input v-model="email" label="Email" type="email" />
          <q-input v-model="password" label="Password" type="password" />
          <div class="q-mt-md">
            <q-btn
              label="Login"
              type="submit"
              color="primary"
              class="full-width"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section v-if="error" class="text-negative">
        {{ errorMessage }}
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useNotification } from "src/composables/useNotification";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref(false);
const errorMessage = ref("");
const authStore = useAuthStore();
const { showSuccess, showError } = useNotification();
const router = useRouter();

watchEffect(() => {
  if (authStore.isAuthenticated) {
    router.push({ name: "dashboard" });
  }
});

const handleLogin = async () => {
  loading.value = true;
  error.value = false;

  try {
    await authStore.login(email.value, password.value);
    showSuccess("Logged in successfully");
    router.push({ name: "dashboard" });
  } catch (err) {
    error.value = true;
    errorMessage.value = err.message || "Login failed";
    showError(errorMessage.value);
  } finally {
    loading.value = false;
  }
};

const onReset = () => {
  email.value = "";
  password.value = "";
};
</script>
