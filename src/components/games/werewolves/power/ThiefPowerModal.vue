<template>
    <Modal :open="open" @close="$emit('close')">
        <div class="flex flex-col gap-2">
            <span class="w-full text-center bg-dark3 p-2 rounded font-bold">Voleur</span>
            <span class="w-full text-center bg-dark3 p-2 rounded">Choisissez un role pour jouer la partie</span>

            <div class="flex flex-row gap-3 mt-6">
                <div 
                    v-for="userId in usersIds" 
                    :key="userId" 
                    class="border rounded border-dark5 flex flex-col items-center pb-3 cursor-pointer hover:bg-dark5 transition-colors"
                    @click="handleChooseRole(userId)"
                >
                    <img :src="`/images/werewolves/icons/${gameRoles[userId]?.picture}.png`">
                    <span>{{ gameRoles[userId]?.name }}</span>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import Modal from '@/components/Modal.vue';
import { computed } from 'vue';
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

const store = useAuthStore();
const socketStore = useSocketStore();

const socket = computed(() => socketStore.getSocket);
const roomId = computed(() => socketStore.getRoomId);

const currentUser = computed(() => store.getCurrentUser);
const stateData = computed(() => socketStore.getRoomData);
const roomData = computed(() => (stateData.value as IWerewolvesRoomData));
const gameRoles = computed(() => roomData.value.gameData?.roles || {});
const usersIds = computed(() => roomData.value.gameData?.thiefUsers);

function handleChooseRole(userId: string) {
    socket.value?.emit('game:werewolves:thief:choose', { roomId: roomId.value, userId: currentUser.value?._id , target: userId });
}
</script>