<template>
    <div class="flex flex-col gap-3 text-white">
        <div class="option-container">
            <label for="mode">Mode de jeu :</label>
            <select 
                id="mode" 
                :disabled="isConfigDisabled" 
                v-model="internalConfig.mode"
            >
                <option value="words">Mots</option>
                <option value="images">Images</option>
                <option value="songs">Sons</option>
            </select>
        </div>

        <div class="option-container">
            <label for="thme">Thème :</label>
            <select 
                id="theme" 
                :disabled="isConfigDisabled" 
                v-model="internalConfig.theme"
            >
                <option value="classic">Classic</option>
            </select>
        </div>

        <div class="option-container">
            <label for="maxPlayers">Nombre de joueurs maximum :</label>
            <input 
                id="maxPlayers" 
                type="number" 
                :disabled="isConfigDisabled" 
                :min="3"
                placeholder="Entrez le nombre maximum de joueurs"
                v-model="internalConfig.maxPlayers"
            >
        </div>

        <div class="option-container">
            <label for="spyCount">Nombre d'espions :</label>
            <input 
                id="spyCount" 
                type="number" 
                :disabled="isConfigDisabled" 
                :min="0"
                placeholder="Entrez le nombre d'espions"
                v-model="internalConfig.spyCount"
            >
        </div>

        <div class="option-container">
            <label for="wordsPerTurn">Nombre de mots par tour :</label>
            <input 
                id="wordsPerTurn" 
                type="number" 
                :disabled="isConfigDisabled" 
                :min="1"
                :max="10"
                v-model="internalConfig.wordsPerTurn"
            >
        </div>

        <div class="option-container">
            <label for="anonymousMode">Mode caché :</label>
            <input 
                id="anonymousMode" 
                type="checkbox" 
                :disabled="isConfigDisabled" 
                v-model="internalConfig.anonymousMode"
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/auth.store';
import { useSocketStore } from '@/modules/socket/socket.store';
import { computed, onMounted, ref, watch } from 'vue';
import { IUndercoverConfig } from './undercover.types';
import { areObjectsEquals } from '@/utils/functions';

const emit = defineEmits(['update'])
const props = defineProps({
    config: {
        type: Object,
        default: () => {},
    }
})

const store = useAuthStore();
const socketStore = useSocketStore();

const internalConfig = ref<IUndercoverConfig>({ 
    maxPlayers: 6,
    wordsPerTurn: 3, 
    mode: 'words', 
    theme: 'classic', 
    spyCount: 1, 
    anonymousMode: true 
});
const timer = ref();
const data = computed(() => socketStore.getRoomData)

const currentUser = computed(() => store.getCurrentUser);
const isOwner = computed(() => data.value.users?.some(({ email, isOwner }) => email === currentUser.value?.email && !!isOwner))
const isConfigDisabled = computed(() => !isOwner.value || data.value.gameState !== 'lobby');

watch(
    () => internalConfig.value,
    () => {
        if (!isOwner.value) return;
        if (timer.value) clearTimeout(timer.value)
        timer.value = setTimeout(() => emit('update', internalConfig.value), 500);
    },
    { deep: true }
)

watch(
    () => ({...props.config}),
    () => {
        if (areObjectsEquals(internalConfig.value, props.config)) return;
        internalConfig.value = (props.config as IUndercoverConfig)
    },
    { deep: true }
)

onMounted(() => {
    if (props.config && JSON.stringify(props.config) !== '{}') {
        internalConfig.value = (props.config as IUndercoverConfig)
    }

    if (isOwner.value) {
        emit('update', internalConfig.value)
    }
})
</script>

<style lang="scss" scoped>
.option-container {
    @apply border border-dark3 rounded p-2 flex flex-row items-center gap-2;

    > label {
        @apply whitespace-nowrap font-semibold;
    }

    input[type="text"], input[type="number"], select {
        @apply bg-transparent w-full;
    }
}
</style>