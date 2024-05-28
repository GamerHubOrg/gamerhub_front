// import { reactive } from "vue";
// import { io } from "socket.io-client";
// import { IRoomData } from "@/types/interfaces";
// import { User } from "@/modules/auth/user";

// interface ISocketState {
//   connected: boolean;
//   room: string;
//   data: Partial<IRoomData>;
// }

// export const state = reactive({
//   connected: false,
//   room: "",
//   data: {},
// } as ISocketState);

// const URL = import.meta.env.VITE_API_URL;

// const socket = io(URL);

// function onConnect() {
//   console.log("Vous êtes connecté.");
//   state.connected = true;
// }

// function onDisconnect() {
//   state.connected = false;
//   state.room = "";
//   console.log("Vous avez été déconnecté.");
// }

// socket.on("connect", onConnect);
// socket.on("disconnect", onDisconnect);

// socket.on("connect_error", (err) => {
//   console.log(`[socket.io] : Error : ${err.message}`);
// });

// export function handleRoomInit(user: User, gameName: string, roomId?: string) {
//   if (!state.connected) return;

//   if (!roomId) handleCreateRoom(user, gameName);
//   else handleJoinRoom(user, roomId);
// }

// export const handleCreateRoom = (user: User, gameName: string) => {
//   socket.emit("room:create", gameName, user);
// };

// export const handleJoinRoom = (user: User, roomId: string) => {
//   socket.emit("room:join", roomId, user);
// };

// export default socket;
