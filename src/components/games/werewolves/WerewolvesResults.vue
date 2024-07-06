<template>
    <div class="flex flex-col gap-6 mt-4">
      <WerewolvesCampWin :game-data="gameData" />
      <WerewolvesTimeline :game-data="gameData" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { IWerewolvesRoomData, IWerewolvesGameData } from './werewolves.types';
  import { useSocketStore } from '@/modules/socket/socket.store';
  import WerewolvesTimeline from '@/components/games/werewolves/timeline/WerewolvesTimeline.vue';
  import WerewolvesCampWin from '@/components/games/werewolves/WerewolvesCampWin.vue';
  
  const socketStore = useSocketStore();
  const roomData = computed(() => (socketStore.getRoomData as IWerewolvesRoomData));
  const gameData = computed(() => (roomData.value.gameData as IWerewolvesGameData));
  </script>
