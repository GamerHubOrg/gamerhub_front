<template>
  <div class="flex flex-col gap-3 text-white">
      <div class="option-container flex flex-col">
          <label for="mode">Composition</label>
          <div class="bg-dark1 rounded-lg p-3 grid grid-cols-3 gap-6 mt-2">
            <div v-for="role in Object.keys(rolesList)" :key="role" class="w-full flex flex-col items-center">
              <span class="text-sm">{{ rolesList[role] }}</span>
              <img :src="getRolePicture(`/src/assets/games/werewolves/images/icons/${role}.png`)" class="w-24">
              <div class="flex flex-row items-center justify-center gap-1 bg-gray-600 p-1 rounded w-full">
                <button 
                  class="bg-dark3 px-2 rounded w-full disabled:cursor-not-allowed" 
                  :disabled="isConfigDisabled"
                  @click="!isConfigDisabled && handleChangeComposition(role, -1)"
                >
                  -
                </button>
                <span class="text-sm px-3">{{ getRoleCount(role) }}</span>
                <button 
                  class="bg-dark3 px-2 rounded w-full disabled:cursor-not-allowed"
                  :disabled="isConfigDisabled"
                  @click="!isConfigDisabled && handleChangeComposition(role, 1)"
                >
                  +
                </button>
              </div>
            </div>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/auth.store';
import { useSocketStore } from '@/modules/socket/socket.store';
import { computed, onMounted, ref, watch } from 'vue';
import { areObjectsEquals, getRolePicture } from '@/utils/functions';
import { IWerewolvesConfig } from './werewolves.types';
import { rolesList } from './werewolves.constants';

const emit = defineEmits(['update', 'change'])
const props = defineProps({
  config: {
      type: Object,
      default: () => {},
  }
})

const store = useAuthStore();
const socketStore = useSocketStore();

const internalConfig = ref<IWerewolvesConfig>({ 
  maxPlayers: 4,
  composition: {
    'wolf': 1,
    'villager': 1,
    'thief': 1,
    'hunter': 1
  },
});
const timer = ref();
const data = computed(() => socketStore.getRoomData)

const currentUser = computed(() => store.getCurrentUser);
const isOwner = computed(() => data.value.users?.some(({ email, isOwner }) => email === currentUser.value?.email && !!isOwner))
const isConfigDisabled = computed(() => !isOwner.value || data.value.gameState !== 'lobby');

const maxRolesCount: Record<string, number> = {
  'thief': 1,
  'hunter': 1,
  'witch': 1,
  'psychic': 1,
  'cupidon': 1,
}

function getRoleCount(role: string) {
  if (!internalConfig.value?.composition) return 0;
  return internalConfig.value.composition[role] || 0;
}

function handleChangeComposition(role: string, direction: number) {
  const roleCount = internalConfig.value.composition[role] || 0;

  if (roleCount + direction < 0) return;
  if (maxRolesCount[role] && roleCount + direction > maxRolesCount[role]) return;

  internalConfig.value.composition[role] = roleCount + direction;
  internalConfig.value.maxPlayers = Object.values(internalConfig.value.composition).reduce((acc, count) => acc + count, 0);
}

watch(
  () => internalConfig.value,
  () => {
      if (!isOwner.value) return;
      if (timer.value) clearTimeout(timer.value)
      emit('change')
      timer.value = setTimeout(() => emit('update', internalConfig.value), 500);
  },
  { deep: true }
)

watch(
  () => ({...props.config}),
  () => {
      if (areObjectsEquals(internalConfig.value, props.config)) return;
      internalConfig.value = (props.config as IWerewolvesConfig)
  },
  { deep: true }
)

onMounted(() => {
  if (props.config && JSON.stringify(props.config) !== '{}') {
      internalConfig.value = (props.config as IWerewolvesConfig)
  }
  if (isOwner.value) {
      emit('update', internalConfig.value)
  }
})
</script>

<style lang="scss" scoped>
.option-container {
  @apply border border-dark3 rounded p-2 gap-2;

  > label {
      @apply whitespace-nowrap font-semibold;
  }

  input[type="text"], input[type="number"], select {
      @apply bg-transparent w-full;
  }
}
</style>