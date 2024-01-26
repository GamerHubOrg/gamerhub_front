import { reactive } from "vue";
import { io } from "socket.io-client";
import { keycloak } from "./keycloak";

export const state = reactive({
  connected: false,
  room: "",
});

const URL = import.meta.env.VITE_API_URL;

const socket = io(URL, {
  extraHeaders: {
    Authorization: keycloak.token,
  },
});

function onConnect() {
  console.log("Vous êtes connecté.");
  state.connected = true;
}

function onDisconnect() {
  state.connected = false;
  state.room = "";
  console.log("Vous avez été déconnecté.");
}

function onRoomCreated(roomId: string) {
  state.room = roomId;
  console.log("Vous avez rejoins la room " + roomId);
}

socket.on("connect", onConnect);
socket.on("disconnect", onDisconnect);
socket.on("room:created", onRoomCreated);

socket.on("connect_error", (err) => {
  console.log(`[socket.io] : Error : ${err.message}`);
});

export default socket;
