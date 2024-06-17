<template>
  <div class="min-h-screen h-full">
    <Navbar />
    <Lobby v-if="!isLobbyCollapsed"/>

    <main class="p-4 h-full pt-20 xl:max-w-screen-xl w-full mx-auto">
      <router-view/>
    </main>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted} from 'vue';
import Lobby from '../components/Lobby.vue';
import Navbar from '../components/Navbar.vue';
import {useAuthStore} from "../modules/auth/auth.store";
import {keycloak, loadUserInfo} from "../services/keycloak";
import { useGamesStore } from '@/modules/games/games.store';

const store = useAuthStore();
const gamesStore = useGamesStore();

const isLobbyCollapsed = computed(() => gamesStore.isLobbyCollapsed);

async function handleSyncUserInfo() {
  try {
    const keycloakUserInfo = loadUserInfo();

    console.log("KEYCLOAK", keycloak);

    console.log("TOKEN", keycloak.token);

    console.log("USERINFO", { keycloakUserInfo });

    if (!keycloakUserInfo || !keycloak.token) return;

    store.setAuthToken(keycloak.token);
    const localUserInfo = await store.getUserInfo(keycloakUserInfo.sub)

    store.setCurrentUser({
      id: keycloakUserInfo.sub,
      firstname: keycloakUserInfo.given_name,
      lastname: keycloakUserInfo.family_name,
      username: localUserInfo.username,
      email: localUserInfo.email,
      roles: keycloak.realmAccess!.roles,
      picture: "https://www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg"
    })

  } catch (err) {
    store.setAuthToken(undefined);
    store.setCurrentUser(undefined);
  }
}

onMounted(async () => {
  await handleSyncUserInfo();
});
</script>
