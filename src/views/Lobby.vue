<script setup lang="ts">
import Room from "@/components/Room.vue";
import { useAuthStore } from "@/modules/auth/auth.store";
import socket, { state } from "@/services/socket";
import { IRoomConfig } from "@/types/interfaces";
import { computed, ref, watch } from "vue";
import { areObjectsEquals } from "@/utils/functions"

const store = useAuthStore();
const config = ref<IRoomConfig>(state.data.config ?? {});
const currentUser = computed(() => store.getCurrentUser);
const checkIsOwner = () => state.data.users?.some(({ email, isOwner }) => email === currentUser.value?.email && !!isOwner);

const getRoomUsers = () => state.data?.users ?? [];
const isOwner = ref(checkIsOwner())

const handleUpdateRoom = () => {
    if (isOwner.value) {
        socket.emit("room:update", state.room, config.value);
    }
}

const handleStartGame = () => {
    if (isOwner.value) {
        socket.emit("room:start", state.room, config.value)
    }
}

watch(
    () => state.data.users,
    () =>
        isOwner.value = checkIsOwner(),
    { deep: true }
)

watch(
    () => state.data.config,
    (oldVal, newVal) => {
        if (!oldVal || !newVal || !areObjectsEquals(oldVal, newVal))
            config.value = state.data.config ?? {}
    },
    { deep: true }
)

watch(
    () => ({ ...config.value }),
    (oldVal, newVal) => {
        if (!areObjectsEquals(oldVal, newVal))
            handleUpdateRoom()
    },
    { deep: true }
)
</script>

<template>
    <Room>
        <div v-if="!currentUser">
            <p>Veuillez vous connecter pour créer ou rejoindre une partie.</p>
        </div>
        <div v-else-if="!state.room">
            <p>Cette room n'existe pas.</p>
        </div>
        <div v-else class="flex gap-10 flex-wrap">
            <div class="flex-1 flex flex-col max-w-[600px] mx-auto gap-3">
                <h1 class="text-3xl">Configuration</h1>
                <label for="maxPlayers">Nombre de joueurs maximum :</label>
                <input id="maxPlayers" type="number" :disabled="!isOwner" min="0" v-model="config.maxPlayers"
                    placeholder="Entrez le nombre maximum de joueurs">
                <button :disabled="!isOwner" class="bg-green-500 text-black" @click="handleStartGame">Lancer la
                    partie</button>
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
    </Room>
</template>