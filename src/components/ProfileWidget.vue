<template>
  <q-card class="my-profile-widget">
    <q-card-section>
      <div class="text-h6">My Profile</div>
      <q-btn icon="edit" @click="toggleEdit" v-if="!isEditing" />
      <q-btn icon="save" @click="updateProfile" v-else />
    </q-card-section>
    <q-card-section>
      <q-avatar size="100px" v-if="user?.avatar" :src="user?.avatar" />
      <q-avatar size="100px" v-else>
        <div class="text-h3">{{ user?.first_name }}</div>
      </q-avatar>
    </q-card-section>
    <q-card-section v-if="!isEditing">
      <!-- Profile view mode -->
      <div><b>Name:</b> {{ user?.first_name }} {{ user?.last_name }}</div>
      <div><b>Email:</b> {{ user?.email }}</div>
      <div><b>Location:</b> {{ user?.location }}</div>
    </q-card-section>
    <q-card-section v-else>
      <!-- Profile edit mode -->
      <q-input v-model="editableUser.first_name" label="First Name" />
      <q-input v-model="editableUser.last_name" label="Last Name" />
      <q-input v-model="editableUser.email" label="Email" />
      <q-input v-model="editableUser.location" label="Location" />
    </q-card-section>
    <q-card-section>
      <q-badge
        v-for="tag in user?.tags"
        :key="tag"
        :label="tag"
        color="primary"
        outline
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "src/stores/user";

const userStore = useUserStore();
const user = computed(() => userStore.currentUser);
const editableUser = ref({});
const isEditing = ref(false);

onMounted(() => {
  userStore.fetchCurrentUser();
});

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    // Limit the editable fields
    editableUser.value = {
      first_name: user.value.first_name,
      last_name: user.value.last_name,
      email: user.value.email,
      location: user.value.location
    };
  }
};

const updateProfile = async () => {
  await userStore.updateCurrentUser(editableUser.value);
  isEditing.value = false;
};
</script>
