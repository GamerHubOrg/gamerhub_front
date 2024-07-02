<template>
  <div class="flex flex-col items-center gap-12 text-white">
    <h2 class="text-3xl">Werewolves</h2>

    {{ gameState }}
    {{ currentRoleTurn }}

    <div ref="playersContainer" class="rounded-full w-5/6 md:w-3/4 lg:w-1/2 aspect-square position relative bg-dark2 flex justify-center items-center">
        <img v-if="gameState === 'night'" :src="noCampfireImage" />
        <img v-else :src="campfireImage" />
        <div 
          v-for="user in users" 
          :key="user.username" 
          :ref="setPlayerRef"
          class="circle-child transition-transform" 
          :class="{'opacity-40 transform scale-90': !user.role?.isAlive}"
        >
          <div v-if="!isUserRoleDiscovered(user)" class="flex flex-col items-center gap-1">
            <div class="w-20 h-20 bg-black rounded-full border border-primary flex justify-center items-center text-white font-bold text-3xl">?</div>
            <div class="flex flex-row items-center gap-1">
              <span>{{ user.username }}</span> 
              <span v-if="currentUserInCouple && gameData?.couple?.includes(user._id)" class="text-lg">❤️</span>
            </div>
          </div>
          <div v-else class="flex flex-col items-center">
            <img :src="user.role?.picture" class="w-24 h-24 rounded-full" />
            <div class="flex flex-row items-center gap-1">
              <span>{{ user.username }}</span> 
              <span v-if="currentUserInCouple && gameData?.couple?.includes(user._id)" class="text-lg">❤️</span>
            </div>
            <span>({{ user.role?.name }})</span>
          </div>
        </div>
    </div>

    <Modal :open="showDisplayRoleDialog" :autoclose="4000" @close="showDisplayRoleDialog = false">
      <div class="flex flex-col">
        <span>Voici votre role</span>
        <img :src="currentUserRole?.picture" />
        {{ currentUserRole?.name }}
      </div>
    </Modal>

    <Modal :open="showStateDialog" :autoclose="1300" @close="showStateDialog = false">
      <div class="flex flex-col">
        <span v-if="gameState === 'day'">Le village se reveille</span>
        <span v-else-if="gameState === 'night'">Le village s'endort</span>
      </div>
    </Modal>

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
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import noCampfireImage from '@/assets/games/werewolves/images/no_campfire.gif';
import campfireImage from '@/assets/games/werewolves/images/campfire.gif';
import { useSocketStore } from "@/modules/socket/socket.store";
import Modal from '@/components/Modal.vue'
import { IWerewolvesConfig, IWerewolvesPlayer, IWerewolvesRoomData } from './werewolves.types';
import { useAuthStore } from "@/modules/auth/auth.store";
import WolfPowerModal from './WolfPowerModal.vue';
import WitchPowerModal from './WitchPowerModal.vue';
import VillageVoteModal from './VillageVoteModal.vue';
import HunterPowerModal from './HunterPowerModal.vue';
import PsychicPowerModal from './PsychicPowerModal.vue';
import CupidonPowerModal from './CupidonPowerModal.vue';
import ThiefPowerModal from './ThiefPowerModal.vue';

const store = useAuthStore();
const socketStore = useSocketStore();

const stateData = computed(() => socketStore.getRoomData)
const socket = computed(() => socketStore.getSocket)

const roomData = computed(() => (stateData.value as IWerewolvesRoomData));
const config = computed(() => (roomData.value.config as IWerewolvesConfig));
const gameData = computed(() => roomData.value.gameData);
const gameState = computed(() => gameData.value?.state || 'night');
const users = computed(() => roomData.value?.users || []);

const currentUser = computed(() => store.getCurrentUser);
const currentUserInCouple = computed(() => gameData.value?.couple?.includes(currentUser.value?._id as string))
const currentUserRole = computed(() => users.value.find((user) => user._id === currentUser.value?._id)?.role)
const currentRoleTurn = computed(() => gameData.value?.roleTurn);

const playersContainer = ref();
const playersRef = ref<any[]>([]);
const showDisplayRoleDialog = ref(false);
const showStateDialog = ref(false);
const showWolfPowerModal = ref(false);
const showWitchPowerModal = ref(false);
const showVillageVoteModal = ref(false);
const showHunterPowerModal = ref(false);
const showPsychicPowerModal = ref(false);
const showCupidonPowerModal = ref(false);
const showThiefPowerModal = ref(false);
const nightPhaseTimer = ref();

function isUserRoleDiscovered(user: IWerewolvesPlayer) {
  const psychicWatch = gameData.value?.psychicWatch || [];
  const isRoleDiscovered = psychicWatch.find((pw) => pw.watch === user._id);
  const isPlayerDead = !user.role?.isAlive;

  return currentUser.value?._id === user._id || (currentUserRole.value?.name === 'Voyante' && isRoleDiscovered) || isPlayerDead
}

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

function handleNightPhase() {
  if (gameState.value !== 'night' || currentUserRole.value?.name !== currentRoleTurn.value) return;

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
  if (gameState.value !== 'day' || !currentRoleTurn.value) return;

  if (currentRoleTurn.value === 'Village') {
    showVillageVoteModal.value =  true;
  }

  if (currentRoleTurn.value === 'Chasseur' && currentUserRole.value?.name === currentRoleTurn.value) {
    showHunterPowerModal.value = true;
  }
}

socket.value?.on('game:werewolves:state', ({ data }) => {
  socketStore.handleRoomUpdate({ data: { ...roomData.value, gameData: data } });
  showStateDialog.value = true;
  nightPhaseTimer.value = setTimeout(() => {
    handleNightPhase();
  }, 1500)
})

socket.value?.on('game:werewolves:start', () => {
  showDisplayRoleDialog.value = true;
})

socket.value?.on("game:werewolves:data", ({ logs, data }) => {
  socketStore.handleRoomUpdate({ data: { ...roomData.value, logs, gameData: data } });
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
  handleSetPlayersPosition();
  handleNightPhase();
  handleDayPhase();
  window.addEventListener('resize', handleSetPlayersPosition);
})

onBeforeUnmount(() => {
  if (nightPhaseTimer.value) clearTimeout(nightPhaseTimer.value);
  window.removeEventListener('resize', handleSetPlayersPosition);
})
</script>

<style lang="scss" scoped>
.circle-child {
  @apply absolute flex flex-col justify-center items-center text-white font-bold w-24 h-24;
}
</style>