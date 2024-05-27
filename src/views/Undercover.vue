<template>
   <div class="flex flex-col items-center gap-7">
        <h2 class="text-3xl">Undercover</h2>
        <div class="grid grid-cols-4 gap-12">
            <div 
                v-for="user in state.data.users" 
                :key="user.socket_id"
                class="flex justify-center items-center"
            >
                <div 
                    class="flex flex-col gap-2 max-w-48 bg-white dark:bg-gray-800 p-3 rounded-md"
                    :class="{
                        'outline outline-green-400': user.id === gameData.playerTurn
                    }"
                >
                    <img :src="user.picture" class="w-full">
                    <span class="truncate">{{ user.username }}</span>
                    <div class="flex flex-col gap-3 items-center">
                        <span class="font-semibold">Mots</span>
                        <div class="flex flex-col gap-2">
                            <span v-for="(word, index) in getUserWords(user)" :key="index">
                                {{ word.word }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="currentUser.id === gameData.playerTurn" class="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex flex-row items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-md">
            <input v-model="wordForm" type="text" class="p-3" @submit="handleSendWord">
            <button class="bg-green-400 rounded" @click="handleSendWord">send</button>
        </div>
   </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/auth.store';
import { User } from '@/modules/auth/user';
import socket, { state } from '@/services/socket';
import { IUndercoverGameData } from '@/types/interfaces';
import { computed, ref } from 'vue';

const store = useAuthStore();
const wordForm = ref(undefined);
const currentUser = computed(() => (store.getCurrentUser as User))
const gameData = computed(() => (state.data.gameData as IUndercoverGameData));

function handleSendWord() {
    if (wordForm.value && wordForm.value === '') return;
    socket.emit("game:undercover:send-word", { roomId: state.room, userId: gameData.value.playerTurn, word: wordForm.value});
}

function getUserWords(user: User) {
    return gameData.value.words?.filter((word) => word.playerId === user.id);
}

socket.emit("game:undercover:initialize", state.room);

socket.on("game:undercover:data", ({ data }) => {
    state.data.gameData = data;
})
</script>