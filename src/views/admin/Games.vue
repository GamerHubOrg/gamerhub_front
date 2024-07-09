<template>
  <div class="mt-10">
    <div class="games-grid">
      <article 
        v-for="(game, i) in liveGames" 
        :key="i"
        class="flex flex-col gap-4 rounded-xl border border-dark3 shadow-2xl bg-dark2 bg-opacity-20 p-6"
      >
        <img v-if="game.gameName === 'speedrundle'" :src="speedrundleImage" alt="speedrundle image" class="rounded-lg">
        <img v-if="game.gameName === 'undercover'" :src="undercoverImage" alt="speedrundle image" class="rounded-lg">
        <img v-if="game.gameName === 'werewolves'" :src="werewolvesImage" alt="speedrundle image" class="rounded-lg">

        <span class="font-bold text-lg cursor-pointer hover:underline" @click="() => handleOpenDetailsModal(game)">{{ game.gameName }}-{{ game.roomId }}</span>
        <span>{{ game.users.length }} / {{ game.config?.maxPlayers }} joueurs</span>
        <button 
          class="bg-dark5 rounded text-sm py-1"
          @click="() => handleOpenDetailsModal(game)"
        >
          Détails
        </button>
        <button 
          class="bg-primary rounded text-sm py-1"
          @click="() => handleDeleteRoom(game.roomId)"
        >
          Supprimer
        </button>
      </article>
    </div>
    <p v-if="liveGames.length === 0" class="text-center">Aucune partie en cours</p>
    <GameDetailsModal :game="selectedGame" :open="showDetailsModal" @close="showDetailsModal = false" />
  </div>
</template>

<script lang="ts" setup>
import { useSocketStore } from '@/modules/socket/socket.store';
import { computed, ref } from 'vue';
import GameDetailsModal from '@/components/admin/GameDetailsModal.vue';
import speedrundleImage from '@/assets/games/speedrundle.webp';
import werewolvesImage from '@/assets/games/werewolves.webp';
import undercoverImage from '@/assets/games/undercover.webp';

const socketStore = useSocketStore();

const liveGames = computed(() => socketStore.getLiveGames);
const socket = computed(() => socketStore.getSocket);
const showDetailsModal = ref(false);
const selectedGame = ref();

function handleDeleteRoom(roomId: string) {
  socket.value?.emit('games:delete', roomId);
}

function handleOpenDetailsModal(game: any) {
  selectedGame.value = game;
  showDetailsModal.value = true;
}
</script>


<style lang="scss" scoped>
.games-grid {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>