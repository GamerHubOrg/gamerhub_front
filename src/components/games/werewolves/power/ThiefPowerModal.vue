<template>
    <Modal :open="open" @close="$emit('close')">
        <div class="flex flex-col gap-2">
            <span class="w-full text-center bg-dark3 p-2 rounded font-bold">{{ $t('games.werewolves.game.thiefPower.title') }}</span>
            <span class="w-full text-center bg-dark3 p-2 rounded">{{ $t('games.werewolves.game.thiefPower.subtitle') }}</span>
            <div class="flex flex-row gap-3 mt-6">
                <div 
                    v-for="userId in usersIds" 
                    :key="userId" 
                    class="border rounded border-dark5 flex flex-col items-center pb-3 transition-colors"
                    :class="{ 
                        'border-primary': selectedPlayer?.target === userId,
                        'cursor-not-allowed': hasAlreadyChoosed,
                        'cursor-pointer hover:bg-dark5': !hasAlreadyChoosed,
                    }"
                    @click="!hasAlreadyChoosed && handleChooseRole(userId)"
                >
                    <img :src="`/images/werewolves/icons/${gameRoles[userId]?.picture}.png`">
                    <span v-if="gameRoles[userId]?.name">{{ $t(gameRoles[userId]?.name) }}</span>
                </div>
            </div>
            <span v-if="hasAlreadyChoosed" class="w-full text-center">{{ $t('games.werewolves.game.thiefPower.waiting') }}</span>
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
const thiefUsers = computed<Record<string, string[]>>(() => roomData.value.gameData?.thiefUsers || {});
const usersIds = computed(() => thiefUsers.value[currentUser.value!._id]);
const swapedRoles = computed(() => roomData.value.gameData?.swapedRoles || []);
const currentTurnSwapedRoles = computed(() => swapedRoles.value.filter((swapedRole) => swapedRole.turn === roomData.value.gameData?.turn));
const selectedPlayer = computed(() => currentTurnSwapedRoles.value.find((swapedRole) => swapedRole.playerId === currentUser.value?._id));
const hasAlreadyChoosed = computed(() => !!selectedPlayer.value);

function handleChooseRole(userId: string) {
    socket.value?.emit('game:werewolves:thief:choose', { roomId: roomId.value, userId: currentUser.value?._id , target: userId });
}
</script>