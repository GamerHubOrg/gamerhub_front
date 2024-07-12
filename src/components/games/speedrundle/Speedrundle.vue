<template>
  <SpeedrundleGame v-if="data.gameState === 'started'" />
  <SpeedrundleResults v-else-if="data.gameState === 'results'" />
  <GameLobby v-else />
</template>

<script setup lang="ts">
import GameLobby from '../GameLobby.vue';
import SpeedrundleGame from './SpeedrundleGame.vue';
import SpeedrundleResults from './SpeedrundleResults.vue';
import { useSocketStore } from '@/modules/socket/socket.store';
import { computed, onMounted } from 'vue';

const socketStore = useSocketStore();
const data = computed(() => socketStore.getRoomData)
const roomId = computed(() => socketStore.getRoomId)
const socket = computed(() => socketStore.getSocket)

onMounted(() => {
  socket.value?.emit('game:speedrundle:get-data', roomId.value)
})
</script>