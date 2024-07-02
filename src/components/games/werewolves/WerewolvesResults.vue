<template>
    <div class="text-white">
      <h1 class="text-center font-bold text-4xl">Win : {{ gameData.campWin }}</h1>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { IWerewolvesRoomData, IWerewolvesGameData } from './werewolves.types';
  import { useSocketStore } from '@/modules/socket/socket.store';
  
  const socketStore = useSocketStore();
  const roomData = computed(() => (socketStore.getRoomData as IWerewolvesRoomData));
  const gameData = computed(() => (roomData.value.gameData as IWerewolvesGameData));
  </script>
