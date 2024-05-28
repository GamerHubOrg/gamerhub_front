<template>
  <div class="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen h-full">
    <Navbar @toggleLobby="toggleLobby" />
    <Lobby v-if="lobbyExpanded" />

    <main class="p-4 h-full pt-20 3xl:max-w-screen-3xl w-full mx-auto">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Lobby from '../components/Lobby.vue';
import Navbar from '../components/Navbar.vue';
import { useAuthStore } from "../modules/auth/auth.store";
import { keycloak, loadUserInfo } from "../services/keycloak";

const lobbyExpanded = ref(false)

function toggleLobby() {
  lobbyExpanded.value = !lobbyExpanded.value;
}

const store = useAuthStore();

async function handleSyncUserInfo() {
  try {
    const userInfo = await loadUserInfo();
    console.log(userInfo)
    store.setAuthToken(keycloak.token);
    console.log(userInfo);
    store.setCurrentUser({
      id: userInfo.sub,
      firstname: userInfo.given_name,
      lastname: userInfo.family_name,
      username: userInfo.preferred_username,
      email: userInfo.email,
      roles: keycloak.realmAccess!.roles,
      picture: "https://www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg"
    })

  } catch (err) {
    store.setAuthToken(undefined);
    store.setCurrentUser(undefined);
    console.log("authenticated.vue", err);
  }
}

onMounted(async () => {
  await handleSyncUserInfo();
});
</script>