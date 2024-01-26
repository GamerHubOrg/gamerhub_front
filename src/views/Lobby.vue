<script setup lang="ts">
import socket, { state } from "@/services/socket";
import { ref } from 'vue';
import axios from '../services/api';

const maxPlayers = ref("")

const checkRoomConfig = () => {
    socket.emit("room:get-config", getRoomId())
}

const createRoom = () => {
    socket.emit("room:create", "codenames", { maxPlayers : maxPlayers.value })
}

const deleteRoom = () => {
    socket.emit("room:delete", getRoomId())
}

socket.on("room:config-sent", (data: any) => console.log("ma conf",JSON.stringify(data)))

const getRoomId = () => {
    return state.room;
}

axios.get("/games")

</script>

<template>
    <div class="flex flex-col max-w-[600px] mx-auto gap-3">
        <h1 class="text-3xl">Creation de lobby</h1>
        <input type="number" v-model="maxPlayers" placeholder="Entrez le nombre maximum de joueurs">
        <button class="bg-blue-500 text-black" @click="checkRoomConfig">Recup ma config</button>
        <button class="bg-red-500 text-black" @click="createRoom">Créer un lobby</button>
        <button class="bg-green-500 text-black" @click="deleteRoom">Suppr la room</button>
        <p>Votre lobby : {{ getRoomId() }}</p>
    </div>
</template>