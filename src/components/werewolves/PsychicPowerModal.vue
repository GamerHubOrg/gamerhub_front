<template>
    <Modal :open="open" @close="$emit('close')">
        <span>Selectionnez un joueur pour voir son role</span>
        <div class="flex flex-row gap-2 flex-wrap mt-4">
            <div
                v-for="user in users" :key="user._id" 
                class="rounded-lg border p-2 flex flex-col justify-between items-center gap-2 cursor-pointer relative h-36 min-w-20"
            >
                <span>{{ user.username }}</span>

                <button 
                    class="bg-primary"
                    @click="() => handleWatchrole(user._id)"
                >
                    Voir le role
                </button>
            </div>
        </div>
    </Modal>
</template>

<script lang="ts" setup>
import Modal from '../Modal.vue';
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
const users = computed(() => roomData.value.users.filter((u) => u.role.isAlive));

function handleWatchrole(userId: string) {
    socket.value?.emit('game:werewolves:psychic:watch', { roomId: roomId.value, userId: currentUser.value?._id, watch: userId });
}
</script>