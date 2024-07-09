<template>
  <div class="mt-10 games-grid">
    <article 
      v-for="(game, i) in liveGames" 
      :key="i"
      class="flex flex-col gap-4 rounded-xl border border-dark3 shadow-2xl bg-dark2 bg-opacity-20 p-6"
    >
      <img v-if="game.gameName === 'speedrundle'" :src="speedrundleImage" alt="speedrundle image" class="rounded-lg">
      <img v-if="game.gameName === 'undercover'" :src="undercoverImage" alt="speedrundle image" class="rounded-lg">
      <img v-if="game.gameName === 'werewolves'" :src="werewolvesImage" alt="speedrundle image" class="rounded-lg">

      <span class="font-bold text-lg">{{ game.gameName }}-{{ game.roomId }}</span>
      <span>{{ game.users.length }} / {{ game.config?.maxPlayers }} joueurs</span>
      <button 
        class="bg-primary rounded text-sm py-1"
        @click="() => handleDeleteRoom(game.roomId)"
      >
        Supprimer
      </button>
    </article>
  </div>
</template>

<script lang="ts" setup>
import { useSocketStore } from '@/modules/socket/socket.store';
import { computed } from 'vue';
import speedrundleImage from '@/assets/games/speedrundle.webp';
import werewolvesImage from '@/assets/games/werewolves.webp';
import undercoverImage from '@/assets/games/undercover.webp';

const socketStore = useSocketStore();

const liveGames = computed(() => socketStore.getLiveGames);
const socket = computed(() => socketStore.getSocket);

function handleDeleteRoom(roomId: string) {
  socket.value?.emit('games:delete', roomId);
}
</script>


<style lang="scss" scoped>
.games-grid {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>