
<template>
  <Undercover v-if="data.gameName === 'undercover'" />
</template>

<script lang="ts" setup>
import Undercover from '@/components/undercover/Undercover.vue';
import { useSocketStore } from '@/modules/socket/socket.store';
import { computed } from 'vue';

const socketStore = useSocketStore();
const data = computed(() => socketStore.getRoomData);
</script>