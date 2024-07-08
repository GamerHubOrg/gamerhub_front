<template>
    <WerewolvesGame v-if="data.gameState === 'started'" />
    <WerewolvesResults v-else-if="data.gameState === 'results'" />
</template>

<script setup lang="ts">
import { useSocketStore } from '@/modules/socket/socket.store';
import WerewolvesGame from './WerewolvesGame.vue';
import WerewolvesResults from './WerewolvesResults.vue';
import { computed, onMounted } from 'vue';

const socketStore = useSocketStore();
const data = computed(() => socketStore.getRoomData)
const roomId = computed(() => socketStore.getRoomId)
const socket = computed(() => socketStore.getSocket)

onMounted(() => {
  socket.value?.emit('game:werewolves:get-data', roomId.value)
})
</script>