<template>
    <div class="flex flex-col gap-3 text-white">
        <div class="option-container">
            <label for="mode">Mode de jeu :</label>
            <select 
                id="mode" 
                :disabled="!isOwner" 
                v-model="config.mode"
            >
                <option value="classic">Classic</option>
                <option value="less_trials">Few trials possible</option>
            </select>
        </div>

        <div class="option-container">
            <label for="thme">Thème :</label>
            <select 
                id="theme" 
                :disabled="!isOwner" 
                v-model="config.theme"
            >
                <option value="league_of_legends">League Of Legends</option>
                <option value="pokemon">Pokemon</option>
                <option value="marvel">Marvel</option>
            </select>
        </div>

        <div class="option-container">
            <label for="maxPlayers">Nombre de joueurs maximum :</label>
            <input 
                id="maxPlayers" 
                type="number" 
                :disabled="!isOwner" 
                :min="1"
                placeholder="Entrez le nombre maximum de joueurs"
                v-model="config.maxPlayers"
            >
        </div>

        <div class="option-container">
            <label for="nbRounds">Nombre de rounds :</label>
            <input 
                id="nbRounds" 
                type="number" 
                :disabled="!isOwner" 
                :min="1"
                :max="10"
                placeholder="Entrez le nombre de rounds"
                v-model="config.nbRounds"
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/auth.store';
import { useSocketStore } from '@/modules/socket/socket.store';
import { computed, onMounted, ref, watch } from 'vue';
import { ISpeedrundleConfig } from './speedrundle.types';

const emit = defineEmits(['update'])
defineProps({
    config: {
        type: Object,
        default: () => {},
    }
})

const store = useAuthStore();
const socketStore = useSocketStore();

const config = ref<ISpeedrundleConfig>({ 
    maxPlayers: 6,
    nbRounds: 1,
    mode: 'classic', 
    theme: 'league_of_legends', 
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