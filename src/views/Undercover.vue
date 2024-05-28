<template>
   <div class="flex flex-col items-center gap-7">
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
                class="flex justify-center items-center"
            >
                <div 
                    class="flex flex-col gap-2 max-w-48 bg-white dark:bg-gray-800 p-3 rounded-md"
                    :class="{
                        'outline outline-green-400': user.id === gameData?.playerTurn && gameData?.state !== 'vote'
                    }"
                >
                    <span v-if="user.id === currentUser.id && gameData?.undercoverPlayerIds?.includes(user.id)">Tu es l'undercover</span>
                    <img :src="user.picture" class="w-full">
                    <span class="text-xs truncate">{{ user.username }} ({{ user.isEliminated ? 'dead' : 'alive' }})</span>
                    <div class="flex flex-col gap-3 items-center mt-2">
                        <span class="font-semibold">Mots</span>
                        <div class="flex flex-col gap-2">
                            <span v-for="(word, index) in getUserWords(user)" :key="`${user.id}-${index}`">
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

        <div v-if="!isCurrentUserEliminated && currentUser.id === gameData?.playerTurn && gameState === 'words'" class="border fixed bottom-10 left-1/2 transform -translate-x-1/2 flex flex-row items-center gap-3 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-3 rounded-md">
            <input v-model="wordForm" type="text" class="p-3" @submit="handleSendWord">
            <button class="bg-green-400 rounded" @click="handleSendWord">send</button>
        </div>
   </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/auth.store';
import { User } from '@/modules/auth/user';
import socket, { state } from '@/services/socket';
import { IUndercoverRoomData } from '@/types/interfaces';
import { computed, ref } from 'vue';

const store = useAuthStore();
const wordForm = ref(undefined);
const currentUser = computed(() => (store.getCurrentUser as User))
const roomData = computed(() => (state.data as IUndercoverRoomData));
const gameData = computed(() => roomData.value.gameData);
const gameState = computed(() => gameData.value?.state || 'words');
const votes = computed(() => gameData.value?.votes || []);
const isCurrentUserEliminated = computed(() => !!roomData.value.users.find((u) => u.id === currentUser.value.id)?.isEliminated);
const isCurrentPlayerTurn = computed(() => currentUser.value.id === gameData.value?.playerTurn);
const hasCurrentPlayerVoted  = computed(() => gameState.value === 'vote' && votes.value.some((vote) => vote.playerId === currentUser.value.id));
const isCurrentPlayerUndercover = computed(() => gameData.value?.undercoverPlayerIds?.includes(currentUser.value.id))

function handleSendWord() {
    if (wordForm.value && wordForm.value === '') return;
    socket.emit("game:undercover:send-word", { roomId: state.room, userId: gameData.value?.playerTurn, word: wordForm.value});
    wordForm.value = undefined;
}

function handleVote(user: User) {
    socket.emit("game:undercover:vote", { roomId: state.room, userId: currentUser.value.id, vote: user.id});
}

function getUserWords(user: User) {
    return gameData.value?.words?.filter((word) => word.playerId === user.id);
}

socket.on("game:undercover:data", ({ data }) => {
    state.data.gameData = data;
})
</script>