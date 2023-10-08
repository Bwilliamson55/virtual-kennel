<template>
  <q-page class="flex flex-center q-pa-md column items-center justify-center">
    <h1>Virtual Kennel</h1>
    <p>This app helps manage your virtual kennel with ease.</p>
    <img alt="Greyhounds racing" src="~assets/greyhounds-racing.png" />
    <div class="q-mt-md row justify-center">
      <q-btn rounded label="Login" class="q-mr-md" to="/login" />
      <q-btn rounded label="Sign Up" to="/signup" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage"
});
</script>
