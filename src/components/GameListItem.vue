<template>
    <div class="relative game-wrapper-background overflow-hidden rounded-2xl p-6 min-h-[470px]"
        :class="disabled ? 'opacity-70' : 'opacity-100'" :style="{ backgroundImage: `url(${img})` }">
        <div class="flex flex-col justify-end h-full gap-2 bg-gradient-to-bl from-transparent to-[#0000004A]">
            <div class="flex gap-2">
                <h2 class="text-white text-3xl font-bold">{{ name }}</h2>
                <div @click="handleShowGameRules" class="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" fill="none">
                        <path fill="#ffffff" fill-rule="evenodd"
                            d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm8-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm.01 8a1 1 0 102 0V9a1 1 0 10-2 0v5z" />
                    </svg>
                </div>
            </div>

            <div class="flex gap-3 justify-between flex-row items-end text-white">
              <div class="flex gap-6">
                  <p class="gameInfosShadow">{{ nbPlayers }} {{$t("shared.players", 2)}}</p>
                  <p class="gameInfosShadow">{{ time }}</p>
              </div>

              <span v-if="disabled" class='gameInfosShadow absolute top-1/2 left-1/2 -translate-x-1/2 p-3 text-center'>
                  {{ $t("home.game-list-item.notAvailable") }}
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

function handleShowGameRules() {
    gameStore.setIsGameRulesCollapsed(false, props.gameName);
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
