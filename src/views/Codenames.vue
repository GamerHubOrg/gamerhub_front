<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/auth.store';
import { computed } from 'vue';
import { useSocketStore } from '../modules/socket/socket.store';

const store = useAuthStore()
const socketStore = useSocketStore()
const currentUser = computed(() => store.getCurrentUser)

const handleRoomStart = () => {
  if (!currentUser.value) return;
  socketStore.handleCreateRoom(currentUser.value, "codenames")
}
</script>

<template>
  <div>
    <div class="border-2 border-gray-300 rounded-lg h-64 overflow-hidden">
      <img src="../assets/games/codenames.png" class="object-cover w-full h-full">
    </div>
    <h1 class="text-center text-4xl font-bold">Codenames</h1>
    <p class="text-center mb-6">Codenames est un jeu ou blablabla</p>
    <button class="bg-white text-black font-bold text-2xl flex w-fit mx-auto px-4 rounded"
      @click="handleRoomStart">JOUER</button>
  </div>
</template>