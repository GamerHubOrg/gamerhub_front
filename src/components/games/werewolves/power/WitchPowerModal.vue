<template>
    <Modal :open="open" @close="$emit('close')">
        <div class="flex flex-col gap-2">
            <span class="w-full text-center bg-dark3 p-2 rounded font-bold">Sorcière</span>
            <p class="w-full text-center bg-dark3 p-2 rounded">Voulez vous utiliser une de vos potions cette nuit ?</p>
            {{ witchSkips }}
            <div class="players-grid mt-4">
                <div
                    v-for="user in users" :key="user._id" 
                    class="rounded-md border-dark3 border-2 p-2 flex flex-col justify-between items-center gap-2 relative h-36 min-w-20"
                >
                    <div class="bg-dark3 h-full w-full text-center p-2 rounded">{{ user.username }}</div>

                    <button 
                        v-if="gameRoles[user._id].isBeingKilled && !isSavePotionUsed && !hasAlreadyChoosed" 
                        class="bg-primary rounded text-sm w-full px-2 py-1 hover:bg-opacity-70"
                        @click="() => handleSavePlayer(user._id)"
                    >
                        Sauver
                    </button>
                    <button 
                        v-else-if="gameRoles[user._id].isAlive && !isKillPotionUsed && !hasAlreadyChoosed" 
                        class="bg-red-500 rounded text-sm w-full px-2 py-1 hover:bg-red-400"
                        @click="() => handleKillPlayer(user._id)"
                    >
                        Empoisonner
                    </button>
                </div>
            </div>
            
            <button 
                v-if="!hasAlreadyChoosed"
                class="underline mt-4 border border-dark3 rounded p-2 hover:bg-dark3 transition-colors"
                @click="handleSkip"
            >
                Ne rien faire
            </button>
            <span v-else class="w-full text-center">En attente des autres sorcières...</span>
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
const roomData = computed(() => (socketStore.getRoomData as IWerewolvesRoomData));
const gameRoles = computed(() => roomData.value.gameData?.roles || {});
const users = computed(() => roomData.value.users.filter((u) => gameRoles.value[u._id].isAlive));
const currentUserRole = computed(() => gameRoles.value[currentUser.value!._id])
const isSavePotionUsed = computed(() => currentUserRole.value?.power.savePotionUsed);
const isKillPotionUsed = computed(() => currentUserRole.value?.power.killPotionUsed);
const witchKills = computed(() => roomData.value.gameData?.witchKills || []);
const witchSaves = computed(() => roomData.value.gameData?.witchSaves || []);
const witchSkips = computed(() => roomData.value.gameData?.witchSkips || []);
const currentTurnVotedPlayers = computed(() => [...witchKills.value, ...witchSaves.value, ...witchSkips.value].filter((vote) => vote.turn === roomData.value.gameData?.turn));
const selectedPlayer = computed(() => currentTurnVotedPlayers.value.find((vote) => vote.playerId === currentUser.value?._id));
const hasAlreadyChoosed = computed(() => !!selectedPlayer.value);

function handleSavePlayer(userId: string) {
    socket.value?.emit('game:werewolves:witch:save', { roomId: roomId.value, userId: currentUser.value?._id, target: userId });
}

function handleKillPlayer(userId: string) {
    socket.value?.emit('game:werewolves:witch:kill', { roomId: roomId.value, userId: currentUser.value?._id, target: userId });
}

function handleSkip() {
    socket.value?.emit('game:werewolves:witch:skip', { roomId: roomId.value, playerId: currentUser.value?._id, target: '' });
}
</script>

<style lang="scss" scoped>
.players-grid {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
}
</style>