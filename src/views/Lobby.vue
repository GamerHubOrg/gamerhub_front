<script lang="ts">
import socket, { state } from "@/services/socket";

export default {
    name: "ConnectionState",
    computed: {
        connected() {
            return state.connected;
        },
    },
    methods: {
        joinGame() {
            socket.emit("room:create", "codenames", { maxPlayers: 5 })
        },
        getRoomId() {
            return state.room;
        }
    }
}
</script>

<template>
    <div>
        <h1>Creation de lobby</h1>
        <button class="bg-red-500 text-black" @click="joinGame">Créer un lobby</button>
        <p>{{ getRoomId() }}</p>
    </div>
</template>