<template>
  <div class="w-full">
    <div v-if="gameState === 'night'" class="bg-blue-950 rounded-lg p-4 w-full flex flex-col gap-3 mb-10">
      <div class="flex flex-row items-center gap-3">
        <span class="font-bold text-2xl">{{ $t('games.werewolves.game.state.night') }}</span>
        <button v-if="currentUserRole?.name === currentRoleTurn && currentUserRole?.isAlive" class="bg-black bg-opacity-25 p-2 rounded-md text-sm" @click="handleNightPhase">{{ $t('games.werewolves.game.state.playMyTurn') }}</button>
      </div>
      <p v-if="currentRoleTurn === 'games.werewolves.roles.psychic.name'">{{ $t('games.werewolves.game.state.psychic') }}</p>
      <p v-if="currentRoleTurn === 'games.werewolves.roles.witch.name'">{{ $t('games.werewolves.game.state.witch') }}</p>
      <p v-if="currentRoleTurn === 'games.werewolves.roles.thief.name'">{{ $t('games.werewolves.game.state.thief') }}</p>
      <p v-if="currentRoleTurn === 'games.werewolves.roles.cupidon.name'">{{ $t('games.werewolves.game.state.cupidon') }}</p>
      <p v-if="currentRoleTurn === 'games.werewolves.roles.wolf.name'">{{ $t('games.werewolves.game.state.wolf') }}</p>
    </div>
    <div v-else-if="gameState === 'day'" class="bg-blue-500 rounded-lg p-4 w-full flex flex-col gap-3 mb-10">
      <div class="flex flex-row items-center gap-3">
        <span class="font-bold text-2xl">{{ $t('games.werewolves.game.state.day') }}</span>
        <button v-if="(currentUserRole?.name === currentRoleTurn || currentRoleTurn === 'Village') && currentUserRole?.isAlive" class="bg-black bg-opacity-25 p-2 rounded-md text-sm" @click="handleDayPhase">{{ $t('games.werewolves.game.state.playMyTurn') }}</button>
      </div>
      <p v-if="currentRoleTurn === 'Village'">{{ $t('games.werewolves.game.state.village') }}</p>
      <p v-if="currentRoleTurn === 'games.werewolves.roles.hunter.name'">{{ $t('games.werewolves.game.state.hunter') }}</p>
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
import { EWerewolvesRoleName, IWerewolvesRoomData } from "./werewolves.types";
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
const huntersBeingKilled = computed(() => Object.keys(gameRoles.value).filter((userId) => gameRoles.value[userId].isBeingKilled && gameRoles.value[userId].name === EWerewolvesRoleName.hunter));

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

  if (currentRoleTurn.value === 'games.werewolves.roles.psychic.name') {
    showPsychicPowerModal.value = true;
  }

  if (currentRoleTurn.value === 'games.werewolves.roles.wolf.name') {
    showWolfPowerModal.value = true;
  }

  if (currentRoleTurn.value === 'games.werewolves.roles.witch.name') {
    showWitchPowerModal.value = true;
  }

  if (currentRoleTurn.value === 'games.werewolves.roles.cupidon.name') {
    showCupidonPowerModal.value = true;
  }

  if (currentRoleTurn.value === 'games.werewolves.roles.thief.name') {
    showThiefPowerModal.value = true;
  }
}

function handleDayPhase() {
  if (gameState.value !== 'day' || !currentUserRole.value?.isAlive || !currentRoleTurn.value) return;

  if (currentRoleTurn.value === 'Village') {
    showVillageVoteModal.value =  true;
  }

  if (currentRoleTurn.value === 'games.werewolves.roles.hunter.name' && currentUserRole.value?.name === currentRoleTurn.value && huntersBeingKilled.value.includes(currentUser.value!._id)) {
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
  [
    () => currentRoleTurn.value, 
    () => gameState.value,
    () => huntersBeingKilled.value,
  ],
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