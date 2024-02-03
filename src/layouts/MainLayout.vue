<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar class="">
        <q-btn
          rounded
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-btn rounded class="q-my-sm" label="Home" to="/" />
        </q-toolbar-title>

        <span>Beta - V1</span>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
      <q-list>
        <q-item-label header> Account Links </q-item-label>

        <EssentialLink
          v-for="link in accountLinks"
          :key="link.title"
          v-bind="link"
          @click="link.icon == 'logout' ? authStore.logout() : ''"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useAuthStore } from "src/stores/auth";
import { useNotification } from "src/composables/useNotification";
const { showSuccess } = useNotification();
const authStore = useAuthStore();

const accountLinks = [
  {
    title: "Log Out",
    caption: "Remove your session",
    icon: "logout",
    link: "#"
  }
];

const essentialLinks = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev"
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework"
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev"
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev"
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev"
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev"
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev"
  }
];
const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
// TODO: move token watcher to its own component
const tokenCheckerIntervalId = setInterval(async () => {
  let refreshed = await authStore.checkTokenValidity();
  if (refreshed) {
    showSuccess("Token refreshed");
  }
}, 1000 * 30); // 30 seconds
onMounted(async () => {
  await authStore.checkTokenValidity();
});
onUnmounted(() => {
  clearInterval(tokenCheckerIntervalId);
});
</script>
