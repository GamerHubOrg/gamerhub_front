<template>
    <Modal :open="open" @close="$emit('close')">
        <span>Choisissez un role pour jouer la partie :</span>

        <div class="flex flex-row gap-3 mt-6">
            <div 
                v-for="user in users" 
                :key="user._id" 
                class="border rounded border-dark5 flex flex-col items-center pb-3 cursor-pointer hover:bg-dark5 transition-colors"
                @click="handleChooseRole(user._id)"
            >
                <img :src="user.role.picture">
                <span>{{ user.role.name }}</span>
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
const users = computed(() => roomData.value.gameData?.thiefUsers);

function handleChooseRole(userId: string) {
    socket.value?.emit('game:werewolves:thief:choose', { roomId: roomId.value, userId: currentUser.value?._id , swap: userId });
}
</script>