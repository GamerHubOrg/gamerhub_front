<template>
  <div class="game-wrapper-background rounded-2xl p-6 min-h-[470px]" :style="{ backgroundImage: `url(${img})` }">
    <div class="flex flex-col justify-end h-full gap-2">
      <h2 class="text-white text-3xl font-bold">{{ name }}</h2>

      <div class="flex gap-3 justify-between flex-row items-end text-white">
        <div class="flex gap-9">
          <p class="gameInfosShadow">{{ nbPlayers }} players</p>
          <p class="gameInfosShadow">{{ time }}</p>
        </div>

        <Button 
          v-if="!roomId" 
          type="primary" 
          shape="squared"
          @click="handleCreateRoom"
        >
          Create room
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import Button from './Button.vue';
import { useSocketStore } from '@/modules/socket/socket.store';
import { useAuthStore } from '@/modules/auth/auth.store';
import { useGamesStore } from '@/modules/games/games.store';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  gameName: {
    type: String,
    required: true,
  },
  nbPlayers: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  routerLink: {
    type: String,
    required: false
  },
  img: {
    type: String,
    required: true
  }
});

const store = useAuthStore();
const socketStore = useSocketStore();
const gameStore = useGamesStore();
const roomId = computed(() => socketStore.getRoomId)
const currentUser = computed(() => store.getCurrentUser);

function handleCreateRoom() {
  if (!currentUser.value) return;
  socketStore.handleCreateRoom(currentUser.value, props.gameName)
  gameStore.setIsLobbyCollapsed(false);
}

</script>

<style scoped>
.gameInfosShadow {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 5px 10px;
  border-radius: 15px;
}

.game-wrapper-background {
  background-size: cover;
  background-position: center;
}
</style>
