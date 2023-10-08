<template>
  <q-page class="flex flex-center q-pa-md items-center justify-center">
    <div class="row">
      <q-form @submit.prevent.stop="handleSignup" class="q-gutter-md column">
        <h1>Sign Up</h1>
        <q-input
          outlined
          rounded
          v-model="email"
          type="email"
          label="Email"
          :rules="[(val) => !!val || 'Field is required']"
        />
        <q-input
          outlined
          rounded
          v-model="phoneNumber"
          label="Phone Number"
          type="tel"
          :rules="[(val) => !smsRequired || 'Field is required']"
        />
        <q-select
          rounded
          v-model="notifyPref"
          hint="This is how you will receive your login code - NOT your kennel notifications"
          class="q-mb-md"
          :options="['Email', 'SMS', 'Both']"
          label="Notification Preference"
        />
        <q-btn label="Sign Up" color="primary" outlined type="submit">
          <template v-if="loading">
            <div class="q-mx-sm">
              <q-spinner-pie color="light-primary" />
            </div>
          </template>
        </q-btn>
      </q-form>
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
              v-model.number="confirmCode"
              filled
              type="number"
              mask="######"
              class="text-center"
              :rules="[
                (val) => (val + '').length === 6 || 'Invalid code length'
              ]"
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
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, toRefs } from "vue";
import { useQuasar } from "quasar";
import { useUserStore } from "../stores/useUserStore";

const $q = useQuasar();
const phoneNumber = ref("");
const notifyPref = ref("Email");
const userStore = useUserStore();
const smsRequired = computed(
  () => notifyPref.value !== "Email" && !phoneNumber.value
);
const { message, code, confirmCode, email, authToken } = toRefs(userStore);
const loading = ref(false);
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

const handleSignup = async () => {
  loading.value = true;
  if (email.value && (notifyPref.value !== "SMS" || phoneNumber.value)) {
    await userStore
      .signUp({
        email: email.value,
        phoneNumber: phoneNumber.value,
        notifyPref: notifyPref.value
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

    console.log(
      `Signing up with Email: ${email.value}, Phone: ${phoneNumber.value}, Preference: ${notifyPref.value}`
    );
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 1em;
}
</style>
