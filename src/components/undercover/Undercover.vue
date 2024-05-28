<template>
  <UndercoverGame v-if="data.gameState === 'started'" />
  <UndercoverResults v-else-if="data.gameState === 'results'" />
</template>

<script setup lang="ts">
import { useSocketStore } from '@/modules/socket/socket.store';
import UndercoverGame from './UndercoverGame.vue';
import UndercoverResults from './UndercoverResults.vue';
import { computed } from 'vue';

const socketStore = useSocketStore();
const data = computed(() => socketStore.getRoomData)

</script>