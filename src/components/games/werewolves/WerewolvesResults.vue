<template>
    <div class="text-white">
      <h1 class="text-center font-bold text-4xl">{{ gameData.campWin }}</h1>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useAuthStore } from '@/modules/auth/auth.store';
  import { IWerewolvesRoomData, IWerewolvesGameData } from './werewolves.types';
  import { useSocketStore } from '@/modules/socket/socket.store';
  
  const store = useAuthStore();
  const socketStore = useSocketStore();
  const roomData = computed(() => (socketStore.getRoomData as IWerewolvesRoomData));
  const gameData = computed(() => (roomData.value.gameData as IWerewolvesGameData));
  
  const userIdsThatPlayed = computed(() => [...new Set(gameData.value.villageVotes.map((v) => v.playerId))]);
  
  const gameUsers = ref([]);
  
  async function fetchUsers() {
    const requests = userIdsThatPlayed.value.map((userId) => store.fetchUser(userId as string));
    const result = (await Promise.allSettled(requests) as [])?.filter((req) => req.status === 'fulfilled');
    gameUsers.value = result.map((req) => req.value) as [];
  }
  
  watch(
    () => gameData.value,
    () => {
      fetchUsers();
    },
    { immediate: true }
  )
  </script>
