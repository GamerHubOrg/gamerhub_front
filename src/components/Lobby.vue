<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/auth.store";
import { IRoomConfig } from '@/types/interfaces';
import { computed, ref, watch, onMounted } from "vue";
import { useSocketStore } from "../modules/socket/socket.store";
import { useRouter } from "vue-router";
import UndercoverConfig from "@/components/games/undercover/UndercoverConfig.vue";
import SpeedrundleConfig from "@/components/games/speedrundle/SpeedrundleConfig.vue";
import WerewolvesConfig from '@/components/games/werewolves/WerewolvesConfig.vue'
import { useGamesStore } from "@/modules/games/games.store";
import Button from '@/components/Button.vue';
import ShareConfigModal from "./config/ShareConfigModal.vue";

const router = useRouter();
const store = useAuthStore();
const socketStore = useSocketStore();
const gameStore = useGamesStore();
const roomId = computed(() => socketStore.getRoomId);
const data = computed(() => socketStore.getRoomData);

const roomCodeTimer = ref<NodeJS.Timeout | undefined>(undefined);
const roomCodeStatus = ref<string>("Copy");
const createGame = ref<string>("undercover");
const joinRoom = ref<string>("");
const updateGame = ref<string>("");

const config = computed(() => data.value.config ?? {});
const currentUser = computed(() => store.getCurrentUser);
const roomUsers = computed(() => data.value?.users ?? []);
const isChangingConfig = ref(false);
const publishConfigModalOpen = ref(false);

const isOwner = computed(() => roomUsers.value.some(
  ({ email, isOwner }) => email === currentUser.value?.email && !!isOwner
));
const minimumPlayers = computed(() => getMinimumPlayers())
const canStartTheGame = computed(
  () =>
    !isChangingConfig.value &&
    isOwner.value &&
    roomUsers.value.length >= minimumPlayers.value
);
const isGameStarted = computed(() => data.value.gameState !== "lobby");
const isConfigDisabled = computed(() => !isOwner.value || isGameStarted.value);

const handleOpenLobby = () => {
  gameStore.setIsLobbyCollapsed(true);
};
const getMinimumPlayers = () => {
  const { gameName } = data.value;
  switch (gameName) {
    case "undercover":
      return import.meta.env.PROD ? 3 : 1;
    case "speedrundle":
      return 1;
    case "werewolves":
      return import.meta.env.PROD ? 4 : 1;
    default:
      return 0;
  }
}

const handleCopyRoomCode = () => {
  if (roomCodeTimer.value) clearTimeout(roomCodeTimer.value);
  roomCodeStatus.value = "Copied";
  navigator.clipboard.writeText(roomId.value);
  roomCodeTimer.value = setTimeout(() => (roomCodeStatus.value = "Copy"), 1200);
};

const handleUpdateRoom = (conf: IRoomConfig) => {
  if (!isOwner.value) {
    return;
  }

  if (data.value.gameState !== "lobby") {
    isChangingConfig.value = false;
    return;
  }

  socketStore.handleUpdateRoom(conf);
  isChangingConfig.value = false;
};

const handlePromoteUser = (id: string) => {
  if (!isOwner.value) {
    return;
  }

  if (data.value.gameState !== "lobby") {
    return;
  }

  socketStore.handlePromoteUser(id);
};
const handleKickUser = (id: string) => {
  if (!isOwner.value) {
    return;
  }

  if (data.value.gameState !== "lobby") {
    return;
  }

  socketStore.handleKickUser(id);
};

const handleRedirectToLogin = () => {
  router.push("/login")
}

const handleRedirectGame = () => {
  router.push(`/room/${roomId.value}`)
}

const handleStartGame = () => {
  if (!isOwner.value) {
    return;
  }
  socketStore.handleStartGame();
};

const handleLeaveRoom = () => {
  if (!currentUser.value) return;
  socketStore.handleLeaveRoom();
  localStorage.removeItem("roomId");
  router.push("/");
};

const handleJoinRoom = () => {
  if (!currentUser.value) return;
  socketStore.handleJoinRoom(currentUser.value, joinRoom.value);
};

const handleRoomStart = () => {
  if (!currentUser.value) return;
  socketStore.handleCreateRoom(currentUser.value, createGame.value);
  updateGame.value = createGame.value;
};

const handleGoToLobby = () => {
  if (!currentUser.value) return;
  socketStore.handleGoToLobby();
};

watch(
  () => data.value,
  (newVal, oldVal) => {
    if (newVal.gameName && oldVal.gameName !== newVal.gameName)
      updateGame.value = newVal.gameName;
  }
);

watch(
  () => updateGame.value,
  (newVal, oldVal) => {
    const isGameDefined = !!oldVal && oldVal !== '';
    if (roomId.value && isGameDefined && oldVal !== newVal && isOwner.value)
      socketStore.handleChangeGame(newVal);
  },
  { deep: true }
);

onMounted(() => {
  if (data.value.gameName) updateGame.value = data.value.gameName;
});
</script>

<template>
  <div class="fixed left-0 top-0 p-6 h-full bg-dark2 z-50 w-full overflow-y-auto md:max-w-[480px] pb-6">
    <div class="flex flex-row items-center justify-between mb-5">
      <h3 class="text-white text-2xl font-bold">{{ $t("lobby.title") }}</h3>
      <button class="rounded bg-white bg-opacity-10 text-white p-2 text-sm" @click="handleOpenLobby">
        <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 1.5L1 13.5M1 1.5L13 13.5" stroke="white" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <div v-if="!currentUser" class="flex items-center justify-center flex-col gap-4 text-white mt-20">
      <svg class="opacity-30" width="100" height="100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="white">
        <path
          d="M40.1 467.1l-11.2 9c-3.2 2.5-7.1 3.9-11.1 3.9C8 480 0 472 0 462.2V192C0 86 86 0 192 0S384 86 384 192V462.2c0 9.8-8 17.8-17.8 17.8c-4 0-7.9-1.4-11.1-3.9l-11.2-9c-13.4-10.7-32.8-9-44.1 3.9L269.3 506c-3.3 3.8-8.2 6-13.3 6s-9.9-2.2-13.3-6l-26.6-30.5c-12.7-14.6-35.4-14.6-48.2 0L141.3 506c-3.3 3.8-8.2 6-13.3 6s-9.9-2.2-13.3-6L84.2 471c-11.3-12.9-30.7-14.6-44.1-3.9zM160 192a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
      </svg>
      <span class="opacity-30">{{ $t("lobby.needToAuth") }}</span>
      <Button shape="squared" color="primary" @click="handleRedirectToLogin">{{ $t("navbar.login") }}</Button>
    </div>

    <div v-else-if="!roomId" class="flex flex-col gap-8">
      <div class="flex flex-col gap-5">
        <h5 class="w-full text-center font-bold text-lg text-white">{{ $t("lobby.notInRoom.newRoom") }}</h5>
        <div class="border border-dark3 rounded p-2 flex flex-row items-center gap-2 text-white">
          <label for="game" class="whitespace-nowrap font-semibold">{{ $t("lobby.notInRoom.gameSelect") }} :</label>
          <select id="game" class="bg-dark3 w-full" v-model="createGame">
            <option value="undercover">Undercover</option>
            <option value="speedrundle">SpeedrunDLE</option>
            <option value="werewolves">Werewolves</option>
          </select>
        </div>
        <button class="w-full bg-[#00A569] rounded-xl p-3 text-sm" @click="handleRoomStart">
          {{ $t("lobby.notInRoom.create") }}
        </button>
      </div>

      <div class="flex flex-row gap-4 items-center text-white text-opacity-15">
        <span class="w-full h-[1px] bg-white bg-opacity-15"></span>
        <span>{{ $t("lobby.notInRoom.or") }}</span>
        <span class="w-full h-[1px] bg-white bg-opacity-15"></span>
      </div>

      <div class="flex flex-col gap-5">
        <h5 class="w-full text-center font-bold text-lg text-white">{{ $t("lobby.notInRoom.joinRoom") }}</h5>

        <input v-model="joinRoom" type="text" placeholder="98DH46Z"
          class="bg-white bg-opacity-5 rounded-2xl p-4 text-white" />

        <button class="w-full bg-[#00A569] rounded-xl p-3 text-sm" @click="handleJoinRoom">
          {{ $t("lobby.notInRoom.join") }}
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col justify-between h-full">
      <div class="flex flex-col gap-5">
        <div class="flex flex-col bg-white bg-opacity-5 rounded-2xl p-4 gap-4">
          <div v-for="user in roomUsers"
            class="bg-white bg-opacity-[6%] rounded-lg p-4 flex flex-row items-center justify-between" :key="user._id">
            <div class="flex flex-row items-center gap-3">
              <img :src="user.picture" class="w-10 h-10 rounded" />
              <div class="truncate text-white flex flex-row items-center gap-2">
                <span :class="{'text-primary' : currentUser._id === user._id}">{{ user.username }} {{ currentUser._id === user._id ? `(${$t("shared.me")})` : "" }}</span>
                <span v-if="user.isOwner">
                  <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 17H18M1 1L4 13H18L21 1L15 8L11 1L7 8L1 1Z" stroke="#E8B914" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </div>
            </div>

            <div v-if="isOwner && user._id !== currentUser._id" class="flex flex-row gap-2">
              <button class="bg-[#E8B9141A] text-[#E8B914] rounded-lg px-3 py-1.5 text-sm"
                @click="handlePromoteUser(user._id)">
                {{ $t("lobby.roomSettings.promote") }}
              </button>
              <button class="bg-[#E847471A] text-[#E84747] rounded-lg px-3 py-1.5 text-sm"
                @click="handleKickUser(user._id)">
                {{ $t("lobby.roomSettings.kick") }}
              </button>
            </div>
          </div>
        </div>

        <Button v-if="data.gameState !== 'lobby'" color="primary" shape="squared"
          @click="handleRedirectGame">
          {{ $t("lobby.roomSettings.joinGame") }}
        </Button>

        <h5 class="w-full text-center font-bold text-lg text-white">{{ $t("lobby.roomSettings.settings") }}</h5>

        <div class="border border-dark3 rounded p-2 flex flex-row items-center gap-2 text-white">
          <label for="game" class="whitespace-nowrap font-semibold">{{ $t("lobby.roomSettings.changeGame") }} :</label>
          <select id="game" class="bg-transparent w-full" v-model="updateGame" :disabled="isConfigDisabled">
            <option value="undercover" class="text-black">Undercover</option>
            <option value="speedrundle" class="text-black">SpeedrunDLE</option>
            <option value="werewolves">Werewolves</option>
          </select>
        </div>

        <UndercoverConfig v-if="data.gameName === 'undercover'" :config="config" @update="handleUpdateRoom"
          @change="isChangingConfig = true" />
        <SpeedrundleConfig v-else-if="data.gameName === 'speedrundle'" :config="config" @update="handleUpdateRoom"
          @change="isChangingConfig = true" />
        <WerewolvesConfig v-else-if="data.gameName === 'werewolves'" :config="config" @update="handleUpdateRoom"
          @change="isChangingConfig = true" />
      </div>


      <div class="flex flex-col gap-4 text-white mt-20 pb-4">
        <p class="italic">
          {{ $t("lobby.roomSettings.minimumPlayers") }} : {{ minimumPlayers }}
        </p>
        <div class="flex flex-row justify-between items-center bg-white bg-opacity-5 rounded-2xl p-4">
          <span class="font-semibold text-2xl">{{ roomId }}</span>
          <div class="flex flex-row items-center gap-2 bg-white bg-opacity-10 rounded-lg p-2 cursor-pointer"
            @click="handleCopyRoomCode">
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 15C1.9 15 1 14.1 1 13V3C1 1.9 1.9 1 3 1H13C14.1 1 15 1.9 15 3M9 7H19C20.1046 7 21 7.89543 21 9V19C21 20.1046 20.1046 21 19 21H9C7.89543 21 7 20.1046 7 19V9C7 7.89543 7.89543 7 9 7Z"
                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text-sm">{{ roomCodeStatus }}</span>
          </div>
        </div>

        <div class="flex flex-row justify-between items-center gap-4">
          <button class="w-full bg-[#E84747] rounded-xl p-3 text-sm" @click="handleLeaveRoom">
            {{ $t("lobby.roomSettings.leave") }}
          </button>
          <button v-if="isOwner" class="w-full bg-[#00A569] rounded-xl p-3 text-sm" :disabled="!canStartTheGame"
            @click="handleStartGame">
            {{ isGameStarted ? $t("lobby.roomSettings.restart") : $t("lobby.roomSettings.start") }}
          </button>
        </div>

        <button v-if="isOwner && isGameStarted" class="w-full bg-blue-400 rounded-xl p-3 text-sm"
          :disabled="!canStartTheGame" @click="handleGoToLobby">
          {{ $t("lobby.roomSettings.backToLobby") }}
        </button>

        <button v-if="isOwner" class="w-full bg-dark5 flex flex-row items-center justify-center gap-2 rounded-xl p-3"
          @click="publishConfigModalOpen = true">
          <svg width="18" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 11V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V11M13 5L9 1M9 1L5 5M9 1V14"
              stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ $t("shared.share") }}
        </button>
      </div>
    </div>
    <ShareConfigModal :open="publishConfigModalOpen" @close="publishConfigModalOpen = false" :config="config" :gameName="data.gameName"/>
  </div>
</template>
