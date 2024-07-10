<template>
    <Modal :open="open" @close="$emit('close')">
        <div class="flex flex-col gap-2">
            <span class="w-full text-center bg-dark3 p-2 rounded font-bold">Voyante</span>
            <span class="w-full text-center bg-dark3 p-2 rounded">Selectionnez un joueur pour voir son role</span>
            <div class="players-grid mt-4">
                <div
                    v-for="user in users" :key="user._id" 
                    class="rounded-md border-dark3 border-2 p-2 flex flex-col justify-between items-center gap-2 relative h-36 min-w-20"
                >
                    <div class="bg-dark3 h-full w-full text-center p-2 rounded">{{ user.username }}</div>

                    <button 
                        class="bg-primary rounded text-sm w-full px-2 py-1"
                        @click="() => handleWatchrole(user._id)"
                    >
                        Voir le role
                    </button>
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

const socketStore = useSocketStore();
const store = useAuthStore();

const socket = computed(() => socketStore.getSocket);
const roomId = computed(() => socketStore.getRoomId);

const currentUser = computed(() => store.getCurrentUser);
const stateData = computed(() => socketStore.getRoomData)
const roomData = computed(() => (stateData.value as IWerewolvesRoomData));
const gameRoles = computed(() => roomData.value.gameData?.roles || {});
const users = computed(() => roomData.value.users.filter((u) => gameRoles.value[u._id].isAlive));

function handleWatchrole(userId: string) {
    socket.value?.emit('game:werewolves:psychic:watch', { roomId: roomId.value, userId: currentUser.value?._id, target: userId });
}
</script>

<style lang="scss" scoped>
.players-grid {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
}
</style>