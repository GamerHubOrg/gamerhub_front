<template>
    <h1>Test game here</h1>
    <p>Devine un nombre entre 1 et 10 !</p>
    <input id="maxPlayers" type="number" min="0" max="10" v-model="guess" placeholder="Entrez votre réponse">
    <button @click="handleSendAnswer" className="bg-blue-500">Envoyer ma réponse !</button>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/auth.store';
import socket, { state } from '@/services/socket';
import { computed, ref } from 'vue';

const store = useAuthStore();
const guess = ref("0");
const currentUser = computed(() => store.getCurrentUser)

const handleSendAnswer = () => {
    socket.emit("game:test:save-answer", state.room, currentUser.value)
    guess.value = "0"
}


socket.emit("game:test:initialize", state.room);

socket.on("game:test:data", (data) => {
    state.data.gameData = data;
})
</script>