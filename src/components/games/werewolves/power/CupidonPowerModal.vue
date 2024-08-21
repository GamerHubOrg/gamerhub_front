<template>
    <Modal :open="open" @close="$emit('close')">
        <div class="flex flex-col gap-2">
            <span class="w-full text-center bg-dark3 p-2 rounded font-bold">Cupidon</span>
            <span class="w-full text-center bg-dark3 p-2 rounded">Choisissez le couple de la partie</span>
        </div>

        <div class="flex flex-row justify-between items-center gap-2 text-black mx-auto w-full my-14">
            <select v-model="firstPlayer" class="bg-dark5 text-white p-2 rounded w-full cursor-pointer" :disabled="hasAlreadyChoosed">
                <option :value="undefined" disabled>Choose player</option>
                <option v-for="user in availableFirstUsers" :key="user._id" :value="user._id">{{ user.username }}</option>
            </select>

            <span class="text-4xl">❤️</span>

            <select v-model="secondPlayer" class="bg-dark5 text-white p-2 rounded w-full cursor-pointer" :disabled="hasAlreadyChoosed">
                <option :value="undefined" disabled>Choose player</option>
                <option v-for="user in availableSecondUsers" :key="user._id" :value="user._id">{{ user.username }}</option>
            </select>
        </div>

        <button 
            v-if="!hasAlreadyChoosed"
            class="bg-primary text-white w-full p-1 rounded hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!firstPlayer || !secondPlayer"
            @click="handleDefineCouple" 
        >
            Confirmer
        </button>
        <span v-else class="w-full text-center">En attente des autres sorcières...</span>
    </Modal>
</template>

<script lang="ts" setup>
import Modal from '@/components/Modal.vue';
import { computed, ref } from 'vue';
import { useSocketStore } from '@/modules/socket/socket.store';
import { IWerewolvesRoomData } from '../werewolves.types';
import { useAuthStore } from '@/modules/auth/auth.store';

defineEmits(['close'])
defineProps({
    open: {
        type: Boolean,
        default: false,
    }
})

const socketStore = useSocketStore();
const store = useAuthStore();

const socket = computed(() => socketStore.getSocket);
const roomId = computed(() => socketStore.getRoomId);

const firstPlayer = ref();
const secondPlayer = ref();

const currentUser = computed(() => store.getCurrentUser);
const stateData = computed(() => socketStore.getRoomData)
const roomData = computed(() => (stateData.value as IWerewolvesRoomData));
const gameRoles = computed(() => roomData.value.gameData?.roles || {});
const users = computed(() => roomData.value.users.filter((u) => gameRoles.value[u._id]?.isAlive));
const availableFirstUsers = computed(() => users.value.filter((u) => u?._id !== secondPlayer.value));
const availableSecondUsers = computed(() => users.value.filter((u) => u?._id !== firstPlayer.value));
const couples = computed(() => roomData.value.gameData?.couple || {});
const selectedPlayer = computed(() => Object.keys(couples.value).find((cupidonId) => cupidonId === currentUser.value?._id));
const hasAlreadyChoosed = computed(() => !!selectedPlayer.value);

function handleDefineCouple() {
    socket.value?.emit('game:werewolves:cupidon:couple', { roomId: roomId.value, couple: [firstPlayer.value, secondPlayer.value] });
}
</script>