<script setup lang="ts">
import socket, { state } from "@/services/socket";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useRoute, useRouter } from "vue-router";
import { IRoomData } from "@/types/interfaces";
import Lobby from "./Lobby.vue";
import Undercover from "./Undercover.vue";

const route = useRoute();
const router = useRouter();
const store = useAuthStore();
const { gameName } = route.params;
const { roomId } = route.query

const isRoomInit = ref(false);
const areLogsExpanded = ref(false);

const currentUser = computed(() => store.getCurrentUser)

const toggleLogs = () => areLogsExpanded.value = !areLogsExpanded.value

// Fonction qui envoie un évenement au serveur

const handleCreateRoom = () => {
    socket.emit("room:create", gameName, currentUser.value)
}

const handleJoinRoom = () => {
    socket.emit("room:join", roomId, currentUser.value)
}

function handleLeaveRoom() {
    isRoomInit.value = false;
    state.room = "";
    state.data = {};
    if (currentUser.value)
        socket.emit("room:leave", roomId);
}

function handleRoomInit() {
    if (!state.connected) return;
    if (!currentUser.value || isRoomInit.value) return;

    if (!roomId) handleCreateRoom();
    else handleJoinRoom();

    isRoomInit.value = true;
}

// Fonction qui recoivent un évenement du serveur

function onRoomCreated(roomId: string, data: IRoomData) {
    console.log("created", roomId, data);

    state.room = roomId;
    state.data = data;
    router.push({ path: `/games/${gameName}/lobby`, query: { roomId } })
}

function onRoomJoined(roomId: string, data: IRoomData) {
    state.room = roomId;
    state.data = data;
}

function onRoomUpdated(data: IRoomData) {
    state.data = data;
}

function onRoomStarted(data: IRoomData) {
    state.data = data;
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
socket.on("room:updated", onRoomUpdated);
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
        handleRoomInit()
    }
)

watch(
    () => route.query?.roomId,
    (newRoom, oldRoom) => {
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
    console.log("before unmount");
    isRoomInit.value = false;
    window.removeEventListener('beforeunload', handleLeaveRoom)
})

</script>

<template>
    <div v-if="state.room"
        class="bg-gray-200 text-black flex flex-col gap-2 fixed z-10 bottom-0 right-0 max-h-[75%] overflow-auto rounded-t-lg">
        <div class="sticky top-0 left-0 flex p-2 justify-between items-center bg-white">
            <button @click="toggleLogs" class="font-bold">Journal de la room</button>
            <button v-if="areLogsExpanded" @click="toggleLogs" class="font-bold text-3xl">&times;</button>
        </div>
        <div v-if="areLogsExpanded" class="p-2">
            <div v-for="log in state.data.logs" class="flex">
                <p><span class="font-bold">{{ new Date(log.date).toLocaleString() }}</span> : <span>{{ log.message }}</span>
                </p>
            </div>
        </div>
    </div>
    <Lobby v-if="state.data.gameState === 'lobby'" />
    <Undercover v-if="state.data.gameState === 'started'" />
</template>