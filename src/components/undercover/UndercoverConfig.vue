<template>
    <div class="flex flex-col gap-3 text-white">
        <div class="option-container">
            <label for="mode">Mode de jeu :</label>
            <select 
                id="mode" 
                :disabled="!isOwner" 
                v-model="config.mode"
            >
                <option value="words">Mots</option>
            </select>
        </div>

        <div class="option-container">
            <label for="thme">Thème :</label>
            <select 
                id="theme" 
                :disabled="!isOwner" 
                v-model="config.theme"
            >
                <option value="classic">Classic</option>
            </select>
        </div>

        <div class="option-container">
            <label for="maxPlayers">Nombre de joueurs maximum :</label>
            <input 
                id="maxPlayers" 
                type="number" 
                :disabled="!isOwner" 
                :min="3"
                placeholder="Entrez le nombre maximum de joueurs"
                v-model="config.maxPlayers"
            >
        </div>

        <div class="option-container">
            <label for="spyCount">Nombre d'espions :</label>
            <input 
                id="spyCount" 
                type="number" 
                :disabled="!isOwner" 
                :min="0"
                placeholder="Entrez le nombre d'espions"
                v-model="config.spyCount"
            >
        </div>

        <div class="option-container">
            <label for="anonymousMode">Mode caché :</label>
            <input 
                id="anonymousMode" 
                type="checkbox" 
                :disabled="!isOwner" 
                v-model="config.anonymousMode"
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/auth.store';
import { useSocketStore } from '@/modules/socket/socket.store';
import { computed, onMounted, ref, watch } from 'vue';
import { IUndercoverConfig } from './undercover.types';

const emit = defineEmits(['update'])
defineProps({
    config: {
        type: Object,
        default: () => {},
    }
})

const store = useAuthStore();
const socketStore = useSocketStore();

const config = ref<IUndercoverConfig>({ 
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

watch(
    () => config.value,
    () => {
        if (timer.value) clearTimeout(timer.value)
        timer.value = setTimeout(() => emit('update', config.value), 300);
    },
    { deep: true }
)

onMounted(() => {
    emit('update', config.value);
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