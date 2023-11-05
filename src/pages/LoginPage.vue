<template>
  <q-page class="flex flex-center q-pa-md column items-center justify-center">
    <h1>Login</h1>
    <q-input outlined v-model="email" label="Email" class="q-mb-md" />
    <q-btn label="Send Login Code" @click="handleLogin">
      <template v-if="loading">
        <div class="q-mx-sm">
          <q-spinner-pie color="light-primary" />
        </div>
      </template>
    </q-btn>
    <q-btn
      class="q-ma-sm"
      flat
      color="primary"
      @click="showDialog = true"
      :loading="loading"
      >I have a Code</q-btn
    >
    <q-dialog v-model="showDialog">
      <q-card>
        <q-card-section class="q-pb-xs">
          <div class="text-h6">Enter Six-Digit Code</div>
        </q-card-section>
        <div class="text-center">
          {{ message ? message.replaceAll('"', "") : "" }}
        </div>
        <q-card-section class="q-py-none">
          <q-input
            v-model="confirmCode"
            filled
            type="text"
            mask="######"
            class="text-center"
            :rules="[(val) => (val + '').length === 6 || 'Invalid code length']"
            lazy-rules
            @blur="handleConfirmCode"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="cancelDialog" />
          <q-btn flat label="Confirm" @click="handleConfirmCode">
            <template v-if="loading">
              <div class="q-mx-sm">
                <q-spinner-pie color="light-primary" />
              </div>
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, toRefs } from "vue";
import { useQuasar } from "quasar";
import { useUserStore } from "../stores/useUserStore";

const $q = useQuasar();

const loading = ref(false);
const userStore = useUserStore();
const { message, code, confirmCode, email, authToken } = toRefs(userStore);
const showDialog = ref(false);
const codeValid = computed(() => (confirmCode.value + "").length === 6);

const cancelDialog = () => {
  showDialog.value = false;
  confirmCode.value = "";
};

const handleConfirmCode = async () => {
  loading.value = true;
  if (codeValid.value) {
    await userStore
      .confirmSignInCode(confirmCode.value)
      .catch((err) => {
        console.log(err);
        $q.notify({
          type: "negative",
          message: "Something went wrong: " + JSON.stringify(err)
        });
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    console.log("Invalid code");
    loading.value = false;
    $q.notify({
      type: "negative",
      message: "Invalid code"
    });
  }
};

const handleLogin = async () => {
  console.log(`Sending login code to ${email.value}`);
  loading.value = true;
  await userStore
    .signIn({
      email: email.value
    })
    .catch((err) => {
      console.log(err);
      $q.notify({
        type: "negative",
        message: "Something went wrong: " + JSON.stringify(err)
      });
    })
    .finally(() => {
      loading.value = false;
    });
  if (code.value !== 200) {
    $q.notify({
      type: "negative",
      message: "Something went wrong : " + message.value
    });
    return;
  } else {
    showDialog.value = true;
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 1em;
}
</style>
