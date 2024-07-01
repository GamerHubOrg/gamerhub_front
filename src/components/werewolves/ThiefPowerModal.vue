<template>
    <Modal :open="open" @close="$emit('close')">
        <span>Choisissez un role pour jouer la partie :</span>

    </Modal>
</template>

<script lang="ts" setup>
import Modal from '../Modal.vue';
import { computed, ref, watch } from 'vue';
import { useSocketStore } from '@/modules/socket/socket.store';
import { IWerewolvesRoomData } from './werewolves.types';

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

const stateData = computed(() => socketStore.getRoomData)
const roomData = computed(() => (stateData.value as IWerewolvesRoomData));
const users = computed(() => roomData.value.users.filter((u) => u.role?.isAlive));

function handleChooseRole(userId: string) {
    socket.value?.emit('game:werewolves:thief:choose', { roomId: roomId.value, swap: userId });
}
</script>