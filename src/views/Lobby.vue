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
    console.log("createRoom", currentUser.value)
    socket.emit("room:create", gameName, currentUser.value)
}

const handleJoinRoom = () => {
    socket.emit("room:join", roomId, currentUser.value)
}

const handleStartGame = () => {
    socket.emit("room:start", getRoomId())
}

function handleLeaveRoom() {
    console.log("should leave room")
    socket.emit("room:leave", roomId);
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

function onRoomUpdate(data: IRoomData) {
    state.data = data;
}

function onRoomLeft() {
    isRoomInit.value = false;
    state.room = "";
    state.data = {};
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
socket.on("room:left", onRoomLeft);
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
        if (!state.connected) return;
        if (!currentUser.value || isRoomInit.value) return;

        console.log("watch", roomId)
        if (!roomId) handleCreateRoom();
        else handleJoinRoom();

        isRoomInit.value = true;
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
    window.addEventListener('beforeunload', handleLeaveRoom)
})

onBeforeUnmount(() => {
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
        <div class="flex-1 flex flex-col">
            <div v-for="user in getRoomUsers()" class="bg-white text-black w-fit px-4 font-bold"
                :class="{ 'bg-red-500': currentUser?.email === user.email }">
                <p>{{ user.username }} <span v-if="user.isOwner">(Owner)</span></p>
            </div>
        </div>
    </div>
    <div v-else>
        <p>Cette room n'existe pas.</p>
    </div>
</template>