<template>
    <Modal :open="open" @close="$emit('close')">
        <span>Voulez vous utiliser votre potion de guérion ou votre potion de mort cette nuit ?</span>
        <div class="flex flex-row gap-2 flex-wrap mt-4">
            <div
                v-for="user in users" :key="user._id" 
                class="rounded-lg border p-2 flex flex-col justify-between items-center gap-2 cursor-pointer relative h-36 min-w-20"
            >
                <span>{{ user.username }}</span>

                <button 
                    v-if="gameRoles[user._id].isBeingKilled && !isSavePotionUsed" 
                    class="bg-primary"
                    @click="() => handleSavePlayer(user._id)"
                >
                    Sauver
                </button>
                <button 
                    v-else-if="gameRoles[user._id].isAlive && !isKillPotionUsed" 
                    class="bg-red-400"
                    @click="() => handleKillPlayer(user._id)"
                >
                    Empoisonner
                </button>
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
const currentUserRole = computed(() => gameRoles.value[currentUser.value!._id])
const isSavePotionUsed = computed(() => currentUserRole.value?.power.savePotionUsed);
const isKillPotionUsed = computed(() => currentUserRole.value?.power.killPotionUsed);

function handleSavePlayer(userId: string) {
    socket.value?.emit('game:werewolves:witch:save', { roomId: roomId.value, userId: currentUser.value?._id, save: userId });
}

function handleKillPlayer(userId: string) {
    socket.value?.emit('game:werewolves:witch:kill', { roomId: roomId.value, userId: currentUser.value?._id, kill: userId });
}
</script>