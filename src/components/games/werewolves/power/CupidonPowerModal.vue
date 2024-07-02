<template>
    <Modal :open="open" @close="$emit('close')">
        <span>Choisissez le couple de la partie</span>
        <div class="flex flex-row items-center gap-3 text-black mx-auto w-fit">
            <select v-model="firstPlayer">
                <option v-for="user in availableFirstUsers" :key="user._id" :value="user._id">{{ user.username }}</option>
            </select>

            <span class="text-4xl">❤️</span>

            <select v-model="secondPlayer">
                <option v-for="user in availableSecondUsers" :key="user._id" :value="user._id">{{ user.username }}</option>
            </select>
        </div>

        <div class="flex justify-center mt-4">
            <button 
                class="bg-primary"
                :disabled="!firstPlayer || !secondPlayer"
                @click="handleDefineCouple" 
            >
                Confirmer
            </button>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import Modal from '@/components/Modal.vue';
import { computed, ref, watch } from 'vue';
import { useSocketStore } from '@/modules/socket/socket.store';
import { IWerewolvesRoomData } from '../werewolves.types';

defineEmits(['close'])
defineProps({
    open: {
        type: Boolean,
        default: false,
    }
})

const socketStore = useSocketStore();

const socket = computed(() => socketStore.getSocket);
const roomId = computed(() => socketStore.getRoomId);

const firstPlayer = ref();
const secondPlayer = ref();

const stateData = computed(() => socketStore.getRoomData)
const roomData = computed(() => (stateData.value as IWerewolvesRoomData));
const gameRoles = computed(() => roomData.value.gameData?.roles || {});
const users = computed(() => roomData.value.users.filter((u) => gameRoles.value[u._id]?.isAlive));
const availableFirstUsers = computed(() => users.value.filter((u) => u?._id !== secondPlayer.value));
const availableSecondUsers = computed(() => users.value.filter((u) => u?._id !== firstPlayer.value));

function handleDefineCouple() {
    socket.value?.emit('game:werewolves:cupidon:couple', { roomId: roomId.value, couple: [firstPlayer.value, secondPlayer.value] });
}

watch(
    [() => availableFirstUsers.value, () => availableSecondUsers.value], 
    () => {
        firstPlayer.value = availableFirstUsers.value[0]?._id;
        secondPlayer.value = availableSecondUsers.value[0]?._id;
    },
    { immediate: true }
)
</script>