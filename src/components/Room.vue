<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useAuthStore } from "@/modules/auth/auth.store";
import { IRoomData } from "@/types/interfaces";
import { useSocketStore } from '../modules/socket/socket.store';
import { useRoute, useRouter } from "vue-router";
import { toast, ToastType } from 'vue3-toastify';
import { useGamesStore } from '@/modules/games/games.store';

const router = useRouter()
const route = useRoute();
const store = useAuthStore();
const socketStore = useSocketStore();
const gameStore = useGamesStore()
const roomStore = socketStore;
const roomId = computed(() => roomStore.getRoomId)
const data = computed(() => roomStore.getRoomData)

socketStore.setupSocket();
const socket = computed(() => roomStore.getSocket).value;

const areLogsExpanded = ref(false);

const currentUser = computed(() => store.getCurrentUser)

const toggleLogs = () => areLogsExpanded.value = !areLogsExpanded.value

// Fonction qui recoivent un évenement du serveur

function onRoomJoined(roomId: string, data: IRoomData) {
  socketStore.handleRoomUpdate({ roomId, data })
  localStorage.setItem("roomId", roomId)
  if (!route.path.includes('room')) {
    router.push('/room/' + roomId);
  }
}

function onRoomUpdated(data: IRoomData) {
  socketStore.handleRoomUpdate({ data })
}

function onRoomStarted(data: IRoomData) {
  socketStore.handleRoomUpdate({ data })
  router.push(`/room/${roomId.value}`)
  gameStore.setIsLobbyCollapsed(true);
}

function onRoomBackToLobby(data: IRoomData) {
  socketStore.handleRoomUpdate({ data })
}

function onRoomDeleted(roomId: string) {
  socketStore.handleRoomUpdate({ roomId: "", data: {} })
  onRoomNotification(`La room ${roomId} a été supprimée.`, "error");
}

function onRoomKicked() {
  socketStore.handleRoomUpdate({ roomId: "", data: {} })
  onRoomNotification("Tu as été kick de la room", "error");
}

function onRoomNotFound(roomId: string) {
  localStorage.removeItem("roomId")
  onRoomNotification(`La room ${roomId} n'existe pas`, "error");
  router.push("/")
}

function onUserNotAuth() {
  console.log("Veuillez vous connecter.")
}

function onRoomNotification(message: string, type: ToastType) {
  toast(message, {
    autoClose: 3000,
    type,
    theme: 'dark'
  });
}

// Définition des listener du socket

if (socket) {
  socket.on("room:created", onRoomJoined);
  socket.on("room:joined", onRoomJoined);
  socket.on("room:updated", onRoomUpdated);
  socket.on("room:started", onRoomStarted);
  socket.on("room:lobbied", onRoomBackToLobby);
  socket.on("room:not-found", onRoomNotFound);
  socket.on("user:not-auth", onUserNotAuth);
  socket.on("room:kicked", onRoomKicked);
  socket.on("room:deleted", onRoomDeleted);
  socket.on("room:notifications:success", (message: string) => onRoomNotification(message, 'success'));
  socket.on("room:notifications:info", (message: string) => onRoomNotification(message, 'info'));
  socket.on("room:notifications:error", (message: string) => onRoomNotification(message, 'error'));
  socket.on("room:notifications:warning", (message: string) => onRoomNotification(message, 'warning'));
}

watch(
  [() => currentUser.value, () => socketStore.getConnected],
  () => {
    const roomId = localStorage.getItem("roomId")
    if (roomId && currentUser.value)
      socketStore.handleJoinRoom(currentUser.value, roomId)
  }
)

// watch(
//     () => route.query?.roomId,
//     (newRoom, oldRoom) => {
//         if (oldRoom && (!newRoom || newRoom !== oldRoom)) {
//             handleLeaveRoom()
//         }
//     }
// )
</script>

<template>
  <slot></slot>
  <div v-if="roomId"
    class="bg-gray-200 text-black flex flex-col gap-2 fixed z-10 bottom-0 right-0 max-h-[75%] overflow-auto rounded-t-lg">
    <div class="sticky top-0 left-0 flex p-2 justify-between items-center bg-white">
      <button @click="toggleLogs" class="font-bold">Journal de la room</button>
      <button v-if="areLogsExpanded" @click="toggleLogs" class="font-bold text-3xl">&times;</button>
    </div>
    <div v-if="areLogsExpanded" class="p-2">
      <div v-for="log in data.logs" class="flex">
        <p><span class="font-bold">{{ new Date(log.date).toLocaleString() }}</span> : <span>{{
          log.message
            }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
