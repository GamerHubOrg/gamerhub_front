<script setup lang="ts">
import socket, { state } from "@/services/socket";
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useRoute, useRouter } from "vue-router";
import { IRoomData, IRoomConfig } from "@/types/interfaces";

const route = useRoute();
const router = useRouter();
const store = useAuthStore();
const { gameName } = route.params;
const { roomId } = route.query

const maxPlayers = ref("");

const getRoomId = () => state.room;
const getRoomUsers = () => state.data?.users;

// Fonction qui envoie un évenement au serveur

const createRoom = () => {
    socket.emit("room:create", gameName, store.getCurrentUser)
}

const joinRoom = () => {
    socket.emit("room:join", roomId, store.getCurrentUser)
}

const startGame = () => {
    socket.emit("room:start", getRoomId())
}

// Fonction qui recoivent un évenement du serveur

function onRoomCreated(roomId: string, data: IRoomData) {
    state.room = roomId;
    state.data = data;
    console.log(data);

    router.push({ path: `/games/${gameName}/lobby`, query: { roomId } })
}

function onRoomJoined(roomId: string, data: IRoomData) {
    console.log("You have joined the room", roomId, data);

    state.room = roomId;
    state.data = data;
}

function onRoomStarted(config: IRoomConfig) {
    state.data.config = config;
    alert("La partie a commencé !")
}

function onUserNotAuth() {
    console.log("Veuillez vous connecter.")
}

// Définition des listener du socket

socket.on("room:created", onRoomCreated);
socket.on("room:joined", onRoomJoined);
socket.on("room:started", onRoomStarted);
socket.on("room:not-found", (roomId: string) => console.log(`La room ${roomId} n'existe pas`))
socket.on("user:not-auth", onUserNotAuth)
socket.on("room:deleted", (roomId: string) => {
    state.room = "";
    alert(`La room ${roomId} a été supprimée.`);
})


onMounted(() => {
    if (!roomId) createRoom();
    else joinRoom();
})

</script>

<template>
    <div class="flex gap-10 flex-wrap">
        <div class="flex-1 flex flex-col max-w-[600px] mx-auto gap-3">
            <h1 class="text-3xl">Configuration</h1>
            <input type="number" v-model="maxPlayers" placeholder="Entrez le nombre maximum de joueurs">
            <button class="bg-green-500 text-black" @click="startGame">Lancer la partie</button>
        </div>
        <div class="flex-1 flex flex-col">
            <div v-for="user in getRoomUsers()" class="bg-white text-black w-fit px-4 font-bold">
                {{ user.username }}
            </div>
        </div>
    </div>
</template>