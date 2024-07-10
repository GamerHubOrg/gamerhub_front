<template>
  <div class="relative game-wrapper-background rounded-2xl p-6 min-h-[470px]"
    :class="disabled ? 'opacity-70' : 'opacity-100'"
    :style="{ backgroundImage: `url(${img})` }">
    <div class="absolute inset-0 bg-gradient-to-bl from-transparent to-[#0000004A]"></div>
    <div class="flex flex-col justify-end h-full gap-2">
      <h2 class="text-white text-3xl font-bold">{{ name }}</h2>

      <div class="flex gap-3 justify-between flex-row items-end text-white">
        <div class="flex gap-6">
          <p class="gameInfosShadow">{{ nbPlayers }} {{$tc("shared.players", 2)}}</p>
          <p class="gameInfosShadow">{{ time }}</p>
        </div>

        <span v-if="disabled" class='gameInfosShadow absolute top-1/2 left-1/2 -translate-x-1/2 p-3 text-center'>
          {{$t("home.game-list-item.notAvailable")}}
        </span>
        <Button v-else-if="!roomId" color="primary" shape="squared" @click="handleCreateRoom">
          {{ $t("home.game-list-item.createRoom") }}
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
import { useRouter } from 'vue-router';

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
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const store = useAuthStore();
const socketStore = useSocketStore();
const gameStore = useGamesStore();
const roomId = computed(() => socketStore.getRoomId)
const currentUser = computed(() => store.getCurrentUser);
const router = useRouter();

function handleCreateRoom() {
  if (!currentUser.value) {
    router.replace("/login")
    return;
  }
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
