<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useAuthStore } from "../modules/auth/auth.store";
import { keycloak, loadUserInfo } from "../services/keycloak";

const store = useAuthStore();

async function handleSyncUserInfo() {
  try {
    if (!keycloak.authenticated) return;

    const userInfo = await loadUserInfo();

    store.setAuthToken(keycloak.token);
    store.setCurrentUser({
      firstname: userInfo.given_name,
      lastname: userInfo.family_name,
      username: userInfo.preferred_username,
      email: userInfo.email,
      roles: keycloak.realmAccess!.roles
    })

  } catch(err) {
    console.error(err);
  }
}

onMounted(async () => {
  await handleSyncUserInfo();
});
</script>
