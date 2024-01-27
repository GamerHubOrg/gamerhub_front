<script setup lang="ts">
import socket, { state } from "@/services/socket";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useRoute, useRouter } from "vue-router";
import { IRoomData, IRoomConfig } from "@/types/interfaces";

const route = useRoute();
const router = useRouter();
const store = useAuthStore();
const { gameName } = route.params;
const { roomId } = route.query

const maxPlayers = ref("");
const isRoomInit = ref(false);

const getRoomId = () => state.room;
const getRoomUsers = () => state.data?.users;
const currentUser = computed(() => store.getCurrentUser)
// Fonction qui envoie un évenement au serveur

const createRoom = () => {
    console.log("createRoom", currentUser.value)
    socket.emit("room:create", gameName, currentUser.value)
}

const joinRoom = () => {
    socket.emit("room:join", roomId, currentUser.value)
}

const startGame = () => {
    socket.emit("room:start", getRoomId())
}

// Fonction qui recoivent un évenement du serveur

function onRoomCreated(roomId: string, data: IRoomData) {
    state.room = roomId;
    state.data = data;
    console.log("onRoomCreated", data);
    router.push({ path: `/games/${gameName}/lobby`, query: { roomId } })
}

function onRoomJoined(roomId: string, data: IRoomData) {
    console.log("You have joined the room", roomId, data);

    state.room = roomId;
    state.data = data;
}

function onRoomLeave(roomId: string, data: IRoomData) {
    console.log("You have leaved the room", data);

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
socket.on("room:leave", onRoomLeave);
socket.on("room:started", onRoomStarted);
socket.on("room:not-found", (roomId: string) => console.log(`La room ${roomId} n'existe pas`))
socket.on("user:not-auth", onUserNotAuth)
socket.on("room:deleted", (roomId: string) => {
    state.room = "";
    alert(`La room ${roomId} a été supprimée.`);
})

watch(
    [() => currentUser.value, () => state.connected],
    () => {
        if (!state.connected) return;
        if (!currentUser.value || isRoomInit.value) return;

        console.log("watch", roomId)
        if (!roomId) createRoom();
        else joinRoom();

        isRoomInit.value = true;
    }
)


function handleDisconnectRoom() {
    console.log("should leave room")
    socket.emit("room:leave", roomId);
}

watch(
    () => route.query?.roomId,
    (newRoom, oldRoom) => {
        if (oldRoom && (!newRoom || newRoom !== oldRoom)) {
            handleDisconnectRoom()
        }
    }
)

onMounted(() => {
    window.addEventListener('beforeunload', handleDisconnectRoom)
})

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleDisconnectRoom)
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