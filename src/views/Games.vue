<template>
  <div>
    {{ currentUser }}
    {{ games }}
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useAuthStore } from "../modules/auth/auth.store";
import { useGamesStore } from "../modules/games/games.store";


const authStore = useAuthStore();
const gamesStore = useGamesStore();

const currentUser = computed(() => authStore.getCurrentUser);
const games = computed(() => gamesStore.getGames);

async function handleFetchGames() {
  try {
    await gamesStore.fetchGames();
  } catch(err) {
    console.error(err)
  }
}

onMounted(() => {
  handleFetchGames();
})
</script>