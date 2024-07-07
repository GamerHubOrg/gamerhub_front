<template>
  <div class="flex flex-col items-center gap-12 text-white">
    <h2 class="text-3xl">Werewolves</h2>

    <WerewolvesGameState />

    <div ref="playersContainer" class="rounded-full w-5/6 md:w-3/4 lg:w-1/2 aspect-square position relative bg-dark2 flex justify-center items-center">
      <img v-if="gameState === 'night'" :src="noCampfireImage" />
      <img v-else :src="campfireImage" />
      <div 
        v-for="user in users" 
        :key="user.username" 
        :ref="setPlayerRef"
        class="circle-child transition-transform" 
        :class="{'opacity-40 transform scale-90': !gameRoles[user._id]?.isAlive}"
      >
        <div v-if="!isUserRoleDiscovered(user)" class="flex flex-col items-center gap-1">
          <div class="w-20 h-20 bg-black rounded-full border border-primary flex justify-center items-center text-white font-bold text-3xl">?</div>
          <div class="flex flex-row items-center gap-1">
            <span>{{ user.username }}</span> 
            <span v-if="currentUserInCouple && gameData?.couple?.includes(user._id)" class="text-lg">❤️</span>
          </div>
        </div>
        <div v-else class="flex flex-col items-center">
          <img :src="`/images/werewolves/icons/${gameRoles[user._id]?.picture}.png`" class="w-24 h-24 rounded-full" />
          <div class="flex flex-row items-center gap-1">
            <span>{{ user.username }}</span> 
            <span v-if="currentUserInCouple && gameData?.couple?.includes(user._id)" class="text-lg">❤️</span>
          </div>
          <span>({{ gameRoles[user._id]?.name }})</span>
        </div>
      </div>
    </div>

    <Modal :open="showDisplayRoleDialog" :autoclose="4000" @close="showDisplayRoleDialog = false">
      <div class="flex flex-col">
        <span>Voici votre role</span>
        <img :src="`/images/werewolves/icons/${currentUserRole?.picture}.png`" />
        {{ currentUserRole?.name }}
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import noCampfireImage from '@/assets/games/werewolves/images/no_campfire.gif';
import campfireImage from '@/assets/games/werewolves/images/campfire.gif';
import { useSocketStore } from "@/modules/socket/socket.store";
import Modal from '@/components/Modal.vue'
import { IWerewolvesPlayer, IWerewolvesRoomData } from './werewolves.types';
import { useAuthStore } from "@/modules/auth/auth.store";
import WerewolvesGameState from './WerewolvesGameState.vue';

const store = useAuthStore();
const socketStore = useSocketStore();

const stateData = computed(() => socketStore.getRoomData)
const socket = computed(() => socketStore.getSocket)

const roomData = computed(() => (stateData.value as IWerewolvesRoomData));
const gameData = computed(() => roomData.value.gameData);
const gameState = computed(() => gameData.value?.state || 'night');
const gameRoles = computed(() => gameData.value?.roles || {});
const users = computed(() => roomData.value?.users || []);

const currentUser = computed(() => store.getCurrentUser);
const currentUserInCouple = computed(() => gameData.value?.couple?.includes(currentUser.value?._id as string))
const currentUserRole = computed(() => gameRoles.value[currentUser.value!._id]);

const playersContainer = ref();
const playersRef = ref<any[]>([]);
const showDisplayRoleDialog = ref(false);

function isUserRoleDiscovered(user: IWerewolvesPlayer) {
  const psychicWatch = gameData.value?.psychicWatch || [];
  const isRoleDiscovered = psychicWatch.find((pw) => pw.watch === user._id);
  const isPlayerDead = !gameRoles.value[user!._id]?.isAlive;
  const gameTurn = gameData.value?.turn || 0;
  const arePlayersWolves = gameTurn > 0 && currentUserRole.value?.name === 'Loup' && gameRoles.value[user!._id]?.name === 'Loup';

  return currentUser.value?._id === user._id || (currentUserRole.value?.name === 'Voyante' && isRoleDiscovered) || isPlayerDead || arePlayersWolves;
}

function setPlayerRef(el: any) {
  playersRef.value.push(el)
}

function handleSetPlayersPosition() {
  const parent = playersContainer.value;
  if (parent) {
    const children = playersRef.value;
    const radius = parent.offsetWidth / 2;
    const childCount = children.length;
    const angleStep = (2 * Math.PI) / childCount;
    children.forEach((child, index) => {
      const angle = index * angleStep;
      const x = radius + radius * Math.cos(angle) - child.offsetWidth / 2;
      const y = radius + radius * Math.sin(angle) - child.offsetHeight / 2;
      child.style.left = `${x}px`;
      child.style.top = `${y}px`;
    });
  }
}

socket.value?.on('game:werewolves:start', () => {
  showDisplayRoleDialog.value = true;
})

socket.value?.on("game:werewolves:data", ({ data }) => {
  // socketStore.handleRoomUpdate({ data: { ...roomData.value, gameData: data } });
  roomData.value.gameData = data;
})

onMounted(() => {
  handleSetPlayersPosition();
  window.addEventListener('resize', handleSetPlayersPosition);
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleSetPlayersPosition);
})
</script>

<style lang="scss" scoped>
.circle-child {
  @apply absolute flex flex-col justify-center items-center text-white font-bold w-24 h-24;
}
</style>