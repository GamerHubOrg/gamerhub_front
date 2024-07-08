<template>
  <div class="min-h-screen h-full">
    <Navbar />
    <Lobby v-show="!isLobbyCollapsed"/>

    <main v-if="!loading" class="p-4 h-full pt-20 xl:max-w-screen-xl w-full mx-auto">
      <router-view v-if="!loading" />
    </main>
    <main v-else class="h-screen flex justify-center items-center">
      <Loader />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import Lobby from '../components/Lobby.vue';
import Navbar from '../components/Navbar.vue';
import Loader from '../components/Loader.vue';
import {useAuthStore} from "../modules/auth/auth.store";
import { useGamesStore } from '@/modules/games/games.store';

const store = useAuthStore();
const gamesStore = useGamesStore();

const isLobbyCollapsed = computed(() => gamesStore.isLobbyCollapsed);
const loading = ref(false);

async function handleSyncUserInfo() {
  try {
    loading.value = true;
    await store.getMe()

  } catch (err) {
    store.setCurrentUser(undefined);
  }
  loading.value = false;
}

onMounted(async () => {
  await handleSyncUserInfo();
});
</script>
