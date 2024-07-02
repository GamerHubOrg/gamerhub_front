<template>
  <Undercover v-if="data.gameName === 'undercover'" />
  <Speedrundle v-if="data.gameName === 'speedrundle'" />
</template>

<script lang="ts" setup>
import Undercover from '@/components/games/undercover/Undercover.vue';
import Speedrundle from '@/components/games/speedrundle/Speedrundle.vue';
import { useSocketStore } from '@/modules/socket/socket.store';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/auth.store';

const socketStore = useSocketStore();
const authStore = useAuthStore();
const currentUser = computed(() => authStore.getCurrentUser)
const data = computed(() => socketStore.getRoomData);
const router = useRouter();

if (!socketStore.getRoomId) {
  const pathRoomId = router.currentRoute.value.fullPath.split("/")[1];
  if (currentUser.value) {
    socketStore.handleJoinRoom(currentUser.value, pathRoomId);
  }
}
</script>