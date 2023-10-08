<template>
  <q-page class="flex flex-center q-pa-md column items-center justify-center">
    <h1>WAT</h1>
    <q-input outlined v-model="email" label="Email" class="q-mb-md" />
    <q-btn label="Send Login Code" @click="handleLogin" />
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "src/stores/useUserStore";
const userStore = useUserStore();

const email = ref("");

const handleLogin = async () => {
  // Logic to send login code via email or SMS
  let res = await userStore.authTokenCheck(userStore.authToken);
  console.log(`Res ${res}`);
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 1em;
}
</style>
