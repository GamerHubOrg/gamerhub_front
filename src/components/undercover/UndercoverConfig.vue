<template>
    <div class="flex flex-col gap-3">
        <div class="border rounded p-2">
            <label for="maxPlayers">Mode de jeu :</label>
            <select 
                id="mode" 
                :disabled="!isOwner" 
                v-model="config.mode"
            >
                <option value="words">Mots</option>
            </select>
        </div>

        <div class="border rounded p-2">
            <label for="maxPlayers">Thème :</label>
            <select 
                id="theme" 
                :disabled="!isOwner" 
                v-model="config.theme"
            >
                <option value="classic">Classic</option>
            </select>
        </div>

        <div class="border rounded p-2">
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

        <div class="border rounded p-2">
            <label for="spyCount">Nombre d'espions :</label>
            <input 
                id="spyCount" 
                type="number" 
                :disabled="!isOwner" 
                min="0"
                placeholder="Entrez le nombre d'espions"
                v-model="config.spyCount"
            >
        </div>

        <div class="border rounded p-2">
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
import { IUndercoverConfig } from '@/types/interfaces';
import { computed, onMounted, ref, watch } from 'vue';

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