<template>
    <div class="text-white">
      <h1 class="text-center font-bold text-3xl mb-6">Win : {{ gameData.campWin }}</h1>
      
      <WerewolvesTimeline :game-data="gameData" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { IWerewolvesRoomData, IWerewolvesGameData } from './werewolves.types';
  import { useSocketStore } from '@/modules/socket/socket.store';
  import WerewolvesTimeline from '@/components/games/werewolves/timeline/WerewolvesTimeline.vue';
  
  const socketStore = useSocketStore();
  const roomData = computed(() => (socketStore.getRoomData as IWerewolvesRoomData));
  const gameData = computed(() => (roomData.value.gameData as IWerewolvesGameData));
  </script>
