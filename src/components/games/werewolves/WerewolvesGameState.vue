<template>
  <div class="w-full">
    <div v-if="gameState === 'night'" class="bg-blue-950 rounded-lg p-4 w-full flex flex-col gap-3 mb-10">
      <div class="flex flex-row items-center gap-3">
        <span class="font-bold text-2xl">Nuit 🌙</span>
        <button v-if="currentUserRole?.name === currentRoleTurn && currentUserRole?.isAlive" class="bg-black bg-opacity-25 p-2 rounded-md text-sm" @click="handleNightPhase">Jouer mon tour</button>
      </div>
      <p v-if="currentRoleTurn === 'Voyante'">La voyante se réveille et regarde dans sa boule de cristal...</p>
      <p v-if="currentRoleTurn === 'Sorcière'">La sorcière se réveille et prépare ses potions...</p>
      <p v-if="currentRoleTurn === 'Voleur'">Le voleur se réveille, faites attention à vos affaires...</p>
      <p v-if="currentRoleTurn === 'Cupidon'">Cupidon ouvre les yeux et décoche une fléche de son arc...</p>
      <p v-if="currentRoleTurn === 'Loup'">Les loups se réveillent{{ gameData?.turn == 1 ? ', se découvrent ' : '' }} et choisissent leur proie...</p>
    </div>
    <div v-else-if="gameState === 'day'" class="bg-blue-500 rounded-lg p-4 w-full flex flex-col gap-3 mb-10">
      <div class="flex flex-row items-center gap-3">
        <span class="font-bold text-2xl">Jour ☀️</span>
        <button v-if="(currentUserRole?.name === currentRoleTurn || currentRoleTurn === 'Village') && currentUserRole?.isAlive" class="bg-black bg-opacity-25 p-2 rounded-md text-sm" @click="handleDayPhase">Jouer mon tour</button>
      </div>
      <p v-if="currentRoleTurn === 'Village'">Les villageois se réveillent et se réunissent autour du feu pour élucider cette histoire de Loup-Garou infiltré au sein du village...</p>
      <p v-if="currentRoleTurn === 'Chasseur'">Le chasseur est mort... Il va tirer sur quelqu'un pour l'entrainer dans chute</p>
    </div>

    <WolfPowerModal 
      :open="showWolfPowerModal" 
      @close="showWolfPowerModal = false"
    />

    <WitchPowerModal
      :open="showWitchPowerModal"
      @close="showWitchPowerModal = false"
    />

    <HunterPowerModal
      :open="showHunterPowerModal"
      @close="showHunterPowerModal = false"
    />

    <PsychicPowerModal
      :open="showPsychicPowerModal"
      @close="showPsychicPowerModal = false"
    />

    <CupidonPowerModal
      :open="showCupidonPowerModal"
      @close="showCupidonPowerModal = false"
    />

    <ThiefPowerModal
      :open="showThiefPowerModal"
      @close="showThiefPowerModal = false"
    />

    <VillageVoteModal
      :open="showVillageVoteModal"
      @close="showVillageVoteModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { useSocketStore } from "@/modules/socket/socket.store";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { IWerewolvesRoomData } from "./werewolves.types";
import { useAuthStore } from "@/modules/auth/auth.store";
import WolfPowerModal from './power/WolfPowerModal.vue';
import WitchPowerModal from './power/WitchPowerModal.vue';
import VillageVoteModal from './power/VillageVoteModal.vue';
import HunterPowerModal from './power/HunterPowerModal.vue';
import PsychicPowerModal from './power/PsychicPowerModal.vue';
import CupidonPowerModal from './power/CupidonPowerModal.vue';
import ThiefPowerModal from './power/ThiefPowerModal.vue';

const store = useAuthStore();
const socketStore = useSocketStore();

const stateData = computed(() => socketStore.getRoomData)
const socket = computed(() => socketStore.getSocket)

const roomData = computed(() => (stateData.value as IWerewolvesRoomData));
const gameData = computed(() => roomData.value.gameData);
const gameState = computed(() => gameData.value?.state || 'night');
const gameRoles = computed(() => gameData.value?.roles || {});

const currentUser = computed(() => store.getCurrentUser);
const currentUserRole = computed(() => gameRoles.value[currentUser.value!._id]);
const currentRoleTurn = computed(() => gameData.value?.roleTurn);

const showWolfPowerModal = ref(false);
const showWitchPowerModal = ref(false);
const showVillageVoteModal = ref(false);
const showHunterPowerModal = ref(false);
const showPsychicPowerModal = ref(false);
const showCupidonPowerModal = ref(false);
const showThiefPowerModal = ref(false);
const nightPhaseTimer = ref();

function handleNightPhase() {
  if (gameState.value !== 'night' || !currentUserRole.value?.isAlive || currentUserRole.value?.name !== currentRoleTurn.value) return;

  if (currentRoleTurn.value === 'Voyante') {
    showPsychicPowerModal.value = true;
  }

  if (currentRoleTurn.value === 'Loup') {
    showWolfPowerModal.value = true;
  }

  if (currentRoleTurn.value === 'Sorcière') {
    showWitchPowerModal.value = true;
  }

  if (currentRoleTurn.value === 'Cupidon') {
    showCupidonPowerModal.value = true;
  }

  if (currentRoleTurn.value === 'Voleur') {
    showThiefPowerModal.value = true;
  }
}

function handleDayPhase() {
  if (gameState.value !== 'day' || !currentUserRole.value?.isAlive || !currentRoleTurn.value) return;

  if (currentRoleTurn.value === 'Village') {
    showVillageVoteModal.value =  true;
  }

  if (currentRoleTurn.value === 'Chasseur' && currentUserRole.value?.name === currentRoleTurn.value) {
    showHunterPowerModal.value = true;
  }
}

socket.value?.on('game:werewolves:state', ({ data }) => {
  socketStore.handleRoomUpdate({ data: { ...roomData.value, gameData: data } });
  nightPhaseTimer.value = setTimeout(() => {
    handleNightPhase();
  }, 1500)
})

watch(
  [() => currentRoleTurn.value, () => gameState.value],
  () => {
    showWolfPowerModal.value = false;
    showWitchPowerModal.value = false;
    showVillageVoteModal.value = false;
    showHunterPowerModal.value =  false;
    showPsychicPowerModal.value = false;
    showCupidonPowerModal.value = false;
    showThiefPowerModal.value = false;
    handleNightPhase();
    handleDayPhase();
  }
)

onMounted(() => {
  handleNightPhase();
  handleDayPhase();
})

onBeforeUnmount(() => {
  if (nightPhaseTimer.value) clearTimeout(nightPhaseTimer.value);
})
</script>