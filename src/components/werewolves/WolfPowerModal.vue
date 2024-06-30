<template>
    <Modal :open="open" @close="$emit('close')">
        <VotePlayers :users="roomData.users" @vote="handleConfirmVote" />
    </Modal>
</template>

<script lang="ts" setup>
import Modal from '../Modal.vue';
import VotePlayers from './VotePlayers.vue';
import { computed } from 'vue';
import { useSocketStore } from '@/modules/socket/socket.store';
import { IWerewolvesRoomData } from './werewolves.types';
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

const currentUser = computed(() => store.getCurrentUser);
const stateData = computed(() => socketStore.getRoomData)
const roomData = computed(() => (stateData.value as IWerewolvesRoomData));

function handleConfirmVote(vote: string) {
    socket.value?.emit('game:werewolves:wolf:vote', { roomId: roomId.value, userId: currentUser.value?._id, vote });
}
</script>