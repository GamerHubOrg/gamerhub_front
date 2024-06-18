<template>
   <div class="flex flex-col items-center gap-7 text-white">
        <h2 class="text-3xl">Undercover</h2>
        <p>Ton mot : <span class="font-semibold">{{ isCurrentPlayerUndercover ? gameData?.spyWord : gameData?.civilianWord }}</span></p>
        <div v-if="!isCurrentUserEliminated">
            <div v-if="gameState === 'words'">
                <span v-if="isCurrentPlayerTurn">Send a word</span>
                <span v-else>Wait other players to send word...</span>
            </div>
            <div v-else-if="gameState === 'vote'">
                <span v-if="!hasCurrentPlayerVoted">Vote for the undercover</span>
                <span v-else>Wait other players to vote...</span>
            </div>
        </div>
        <div v-else>Tu es éliminé</div>

        <div class="grid grid-cols-4 gap-12">
            <div 
                v-for="user in roomData.users" 
                :key="user.socket_id"
                class="flex justify-center items-center text-black"
            >
                <div 
                    class="flex flex-col gap-2 max-w-48 bg-dark5 text-white p-3 rounded-md"
                    :class="{
                        'outline outline-green-400': user._id === gameData?.playerTurn && gameData?.state !== 'vote'
                    }"
                >
                    <span v-if="user._id === currentUser._id && gameData?.undercoverPlayerIds?.includes(user._id) && !isAnonymouseMode">Tu es l'undercover</span>
                    <img :src="user.picture" class="w-full">
                    <span class="text-xs truncate">{{ user.username }} ({{ user.isEliminated ? 'dead' : 'alive' }})</span>
                    <div class="flex flex-col gap-3 items-center mt-2">
                        <span class="font-semibold">Mots</span>
                        <div class="flex flex-col gap-2">
                            <span v-for="(word, index) in getUserWords(user)" :key="`${user._id}-${index}`">
                                {{ word.word }}
                            </span>
                        </div>
                    </div>
                    <button 
                        v-if="gameState === 'vote' && !hasCurrentPlayerVoted && !user.isEliminated && !isCurrentUserEliminated" 
                        class="bg-green-400 rounded" 
                        @click="() => handleVote(user)"
                    >
                        vote
                    </button>
                </div>
            </div>
        </div>

        <form 
            v-if="!isCurrentUserEliminated && currentUser._id === gameData?.playerTurn && gameState === 'words'" 
            class="border fixed bottom-10 left-1/2 transform -translate-x-1/2 flex flex-row gap-3 bg-white border-gray-200 p-3 rounded-md"
            @submit="handleSendWord"
        >
            <input v-model="wordForm" type="text" class="border border-primary border-opacity-20 rounded-md p-3 text-black">
            <button type="submit" class="bg-green-400 rounded p-3" @click="handleSendWord">send</button>
        </form>
   </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/auth.store';
import { User } from '@/modules/auth/user';
import { useSocketStore } from '../../modules/socket/socket.store';
import { computed, ref } from 'vue';
import { IUndercoverRoomData } from './undercover.types';

const store = useAuthStore();
const socketStore = useSocketStore();

const stateData = computed(() => socketStore.getRoomData)
const roomId = computed(() => socketStore.getRoomId)
const socket = computed(() => socketStore.getSocket)

const wordForm = ref(undefined);
const currentUser = computed(() => (store.getCurrentUser as User))
const roomData = computed(() => (stateData.value as IUndercoverRoomData));
const gameData = computed(() => roomData.value.gameData);
const gameState = computed(() => gameData.value?.state || 'words');
const votes = computed(() => gameData.value?.votes || []);
const isAnonymouseMode = computed(() => !!roomData.value.config?.anonymousMode);
const isCurrentUserEliminated = computed(() => !!roomData.value.users.find((u) => u._id === currentUser.value._id)?.isEliminated);
const isCurrentPlayerTurn = computed(() => currentUser.value._id === gameData.value?.playerTurn);
const hasCurrentPlayerVoted  = computed(() => gameState.value === 'vote' && votes.value.some((vote) => vote.playerId === currentUser.value._id));
const isCurrentPlayerUndercover = computed(() => gameData.value?.undercoverPlayerIds?.includes(currentUser.value._id))

function handleSendWord(e: Event) {
    e.preventDefault();

    if (wordForm.value && wordForm.value === '') return;
    socket.value?.emit("game:undercover:send-word", { roomId: roomId.value, userId: gameData.value?.playerTurn, word: wordForm.value});
    wordForm.value = undefined;
}

function handleVote(user: User) {
    socket.value?.emit("game:undercover:vote", { roomId: roomId.value, userId: currentUser.value._id, vote: user._id});
}

function getUserWords(user: User) {
    return gameData.value?.words?.filter((word) => word.playerId === user._id);
}

socket.value?.on("game:undercover:data", ({ logs, data }) => {
    socketStore.handleRoomUpdate({ data: { ...roomData.value, logs, gameData: data } });
})
</script>