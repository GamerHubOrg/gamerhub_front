import { defineStore } from "pinia";
import { IRoomConfig, IRoomData } from "@/types/interfaces";
import { io, Socket } from "socket.io-client";
import { User } from "../auth/user";

interface SocketState {
  connected: boolean;
  roomId: string;
  data: Partial<IRoomData>;
  socket: Socket<any, any> | undefined;
}

const URL = import.meta.env.VITE_API_URL;
const socket = io(URL);

export const useSocketStore = defineStore("socket", {
  state: () =>
    ({
      connected: false,
      roomId: "",
      data: {},
      socket: undefined,
    } as SocketState),
  getters: {
    getConnected: (state) => state.connected,
    getRoomId: (state) => state.roomId,
    getRoomData: (state) => state.data,
    getSocket: (state) => state.socket,
  },
  actions: {
    setupSocket() {
      socket.on("connect", this.onConnect);
      socket.on("disconnect", this.onDisconnect);
      socket.on("connect_error", this.onConnectError);
      this.socket = socket;
    },
    onConnect() {
      console.log("Vous êtes connecté.");
      this.connected = true;
    },
    onDisconnect() {
      console.log("Vous avez été déconnecté.");
      this.connected = false;
      this.roomId = "";
      this.data = {};
    },
    onConnectError(err: any) {
      console.log(`[socket.io] : Error : ${err.message}`);
    },
    handleRoomUpdate({ roomId, data, connected }: Partial<SocketState>) {
      if (connected !== undefined) this.connected = connected;
      if (roomId !== undefined) this.roomId = roomId;
      if (data !== undefined) this.data = data;
    },
    handleCreateRoom(user: User, gameName: string) {
      socket.emit("room:create", gameName, user);
    },
    handleJoinRoom(user: User, roomId: string) {
      socket.emit("room:join", roomId, user);
    },
    handleLeaveRoom() {
      socket.emit("room:leave", this.roomId);
      this.roomId = "";
      this.data = {};
    },
    handleStartGame(roomId: string) {
      socket.emit("room:start", roomId);
      socket.emit(`game:${this.data.gameName}:initialize`, roomId);
    },
    handleGoToLobby(roomId: string) {
      socket.emit("room:lobby", roomId);
    },
    handleUpdateRoom(roomId: string, config: IRoomConfig) {
      socket.emit("room:update", roomId, config);
    },
    handleChangeGame(roomId: string, game: string) {
      socket.emit("room:change-game", roomId, game);
    },
  },
});
