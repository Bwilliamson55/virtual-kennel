<template>
  <q-page class="flex flex-center q-pa-md column items-center justify-center">
    <h1 class="text-center q-my-xs">Virtual Kennel</h1>
    <p>
      This is a proof of concept app to track your favorite greyhounds races and
      results.
    </p>
    <q-img
      class="flex flex-center"
      alt="Greyhounds racing"
      src="~assets/greyhounds-racing.png"
      spinner-color="blue"
      style="max-width: 450px"
    />
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
