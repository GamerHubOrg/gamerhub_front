<template>
  {{ data.gameState }}
  <UndercoverGame v-if="data.gameState === 'started'" />
  <UndercoverResults v-else-if="data.gameState === 'results'" />
  <GameLobby v-else />
</template>

<script setup lang="ts">
import { useSocketStore } from '@/modules/socket/socket.store';
import UndercoverGame from './UndercoverGame.vue';
import UndercoverResults from './UndercoverResults.vue';
import GameLobby from '../GameLobby.vue';
import { computed, onMounted } from 'vue';

const socketStore = useSocketStore();
const data = computed(() => socketStore.getRoomData)
const roomId = computed(() => socketStore.getRoomId)
const socket = computed(() => socketStore.getSocket)

onMounted(() => {
  socket.value?.emit('game:undercover:get-data', roomId.value)
})
</script>