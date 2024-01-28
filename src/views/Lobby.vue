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

const handleCreateRoom = () => {
    socket.emit("room:create", gameName, currentUser.value)
}

const handleJoinRoom = () => {
    socket.emit("room:join", roomId, currentUser.value)
}

const handleStartGame = () => {
    socket.emit("room:start", getRoomId())
}

function handleLeaveRoom() {
    console.log("room leave")
    isRoomInit.value = false;
    state.room = "";
    state.data = {};
    socket.emit("room:leave", roomId);
}

function handleRoomInit() {
    console.log("room init");
    
    if (!state.connected) return;
    if (!currentUser.value || isRoomInit.value) return;

    if (!roomId) handleCreateRoom();
    else handleJoinRoom();

    isRoomInit.value = true;
}

// Fonction qui recoivent un évenement du serveur

function onRoomCreated(roomId: string, data: IRoomData) {
    console.log("Your room has been created", roomId);
    state.room = roomId;
    state.data = data;
    console.log("onRoomCreated", data);
    router.push({ path: `/games/${gameName}/lobby`, query: { roomId } })
}

function onRoomJoined(roomId: string, data: IRoomData) {
    console.log("Someone has joined the room", roomId);

    state.room = roomId;
    state.data = data;
}

function onRoomUpdate(data: IRoomData) {
    console.log("The room has been updated", data);
    state.data = data;
}

function onRoomStarted(config: IRoomConfig) {
    state.data.config = config;
    alert("La partie a commencé !")
}

function onRoomNotFound(roomId: string) {
    console.log(`La room ${roomId} n'existe pas`);
}

function onUserNotAuth() {
    console.log("Veuillez vous connecter.")
}

// Définition des listener du socket

socket.on("room:created", onRoomCreated);
socket.on("room:joined", onRoomJoined);
socket.on("room:update", onRoomUpdate);
socket.on("room:started", onRoomStarted);
socket.on("room:not-found", onRoomNotFound)
socket.on("user:not-auth", onUserNotAuth)
socket.on("room:deleted", (roomId: string) => {
    state.room = "";
    state.data = {};
    alert(`La room ${roomId} a été supprimée.`);
})

watch(
    [() => currentUser.value, () => state.connected],
    () => {
        console.log("watch");
        
        handleRoomInit()
    }
)

watch(
    () => route.query?.roomId,
    (newRoom, oldRoom) => {
        console.log("old", oldRoom);
        console.log("new", newRoom);

        if (oldRoom && (!newRoom || newRoom !== oldRoom)) {
            handleLeaveRoom()
        }
    }
)

onMounted(() => {
    handleRoomInit()
    window.addEventListener('beforeunload', handleLeaveRoom)
})

onBeforeUnmount(() => {
    isRoomInit.value = false;
    window.removeEventListener('beforeunload', handleLeaveRoom)
})

</script>

<template>
    <div v-if="state.room" class="flex gap-10 flex-wrap">
        <div class="flex-1 flex flex-col max-w-[600px] mx-auto gap-3">
            <h1 class="text-3xl">Configuration</h1>
            <input type="number" v-model="maxPlayers" placeholder="Entrez le nombre maximum de joueurs">
            <button class="bg-green-500 text-black" @click="handleStartGame">Lancer la partie</button>
        </div>
        <div class="flex-1 flex gap-5 flex-wrap">
            <div v-for="user in getRoomUsers()"
                class="bg-white text-black w-[150px] h-[150px] p-4 flex flex-col items-center text-center font-bold rounded shadow-lg"
                :class="{ '!bg-red-500': currentUser?.email === user.email }">
                <img class="w-16 h-16 rounded-full" :src="currentUser?.picture" alt="user photo" />
                <p class="break-words">{{ user.username }} <span v-if="user.isOwner">(Owner)</span></p>
            </div>
        </div>
    </div>
    <div v-else>
        <p>Cette room n'existe pas.</p>
    </div>
</template>