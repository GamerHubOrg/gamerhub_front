<template>
  <div class="flex flex-col items-center gap-20 text-white">
    <h2 class="text-3xl">Werewolves</h2>

    {{ config }}

    <div ref="playersContainer" class="rounded-full w-5/6 md:w-3/4 lg:w-1/2 aspect-square position relative bg-dark2 flex justify-center items-center">
      <img v-if="gameState === 'vote'" :src="campfireImage" />
      <img v-else-if="gameState === 'night'" :src="noCampfireImage" />
      <div v-for="user in users" :key="user.username" class="circle-child" :ref="setPlayerRef">
        <img :src="villagerImage" class="w-20" />
        <span>{{ user.username }}</span>
      </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import noCampfireImage from '@/assets/games/werewolves/images/no_campfire.gif';
import campfireImage from '@/assets/games/werewolves/images/campfire.gif';
import villagerImage from '@/assets/games/werewolves/images/villager.png';
import { useSocketStore } from "@/modules/socket/socket.store";
import { IWerewolvesConfig, IWerewolvesRoomData } from './werewolves.types';

const socketStore = useSocketStore();

const stateData = computed(() => socketStore.getRoomData)
const socket = computed(() => socketStore.getSocket)

const roomData = computed(() => (stateData.value as IWerewolvesRoomData));
const config = computed(() => (roomData.value.config as IWerewolvesConfig));
const gameData = computed(() => roomData.value.gameData);
const gameState = computed(() => gameData.value?.state || 'night');

const playersContainer = ref();
const playersRef = ref<any[]>([]);

const users = [
  { username: 'user 1' },
  { username: 'user 2' },
  { username: 'user 3' },
  { username: 'user 4' },
  { username: 'user 5' },
  { username: 'user 6' },
]

function setPlayerRef(el: any) {
  playersRef.value.push(el)
}

function handleSetPlayersPosition() {
  const parent = playersContainer.value;
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

socket.value?.on("game:werewolves:data", ({ logs, data }) => {
  console.log(data);
  socketStore.handleRoomUpdate({ data: { ...roomData.value, logs, gameData: data } });
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