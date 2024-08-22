<template>
  <div class="min-h-screen h-full">
    <Navbar />
    <Lobby v-show="!isLobbyCollapsed" />
    <GameRules v-show="!isGameRulesCollapsed" />

    <main class="p-4 h-full pt-20 xl:max-w-screen-xl w-full mx-auto">
      <div class="mt-10 bg-dark3 rounded-md p-3">
        <nav class="flex gap-6" aria-label="Tabs">
          <router-link
            v-for="tab in tabs"
            :key="tab.name"
            :to="tab.link"
            exact-active-class="bg-opacity-100 bg-primary text-white"
            class="shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-primary hover:bg-opacity-40 hover:text-white"
          >
            {{ tab.name }}
          </router-link>
        </nav>
      </div>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from "vue";
import Lobby from "../components/Lobby.vue";
import Navbar from "../components/Navbar.vue";
import { useAuthStore } from "../modules/auth/auth.store";
import { useRoute, useRouter } from "vue-router";
import { useGamesStore } from "@/modules/games/games.store";
import { useSocketStore } from "@/modules/socket/socket.store";
import GameRules from "@/components/GameRules.vue";

const gamesStore = useGamesStore();
const socketStore = useSocketStore();
const store = useAuthStore();
const router = useRouter();
const route = useRoute();

const isLobbyCollapsed = computed(() => gamesStore.isLobbyCollapsed);
const isGameRulesCollapsed = computed(() => gamesStore.isGameRulesCollapsed);
const socket = computed(() => socketStore.getSocket);

const tabs = [
    { name: 'Tableau de bord', link: '/admin' },
    { name: 'Utilisateurs', link: '/admin/users' },
    { name: 'Parties', link: '/admin/games' },
    { name: 'Banissements', link: '/admin/banishments' },
]

async function handleSyncUserInfo() {
  try {
    await store.getMe();
  } catch (err) {
    store.setCurrentUser(undefined);
    router.replace("login");
  }
}

function handleGetLiveGames() {
  socket.value?.emit('games:get:live');
}

socket.value?.on('games:live:data', (games: any) => {
  socketStore.setLiveGames(games);
})

onMounted(async () => {
  await handleSyncUserInfo();

  if (!store.currentUser?.roles?.includes('admin')){
    router.replace('/');
    return
  };

  handleGetLiveGames();
});

watch(
  () => route.fullPath,
  () => {
    if (!store.currentUser?.roles?.includes('admin')){
      router.replace('/');
      return
    };

    handleGetLiveGames();
  }
)
</script>
