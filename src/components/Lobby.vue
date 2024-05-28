<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/auth.store";
import { IRoomConfig } from "@/types/interfaces";
import { computed, ref, watch, onMounted } from 'vue';
import { areObjectsEquals } from "@/utils/functions"
import { useSocketStore } from '../modules/socket/socket.store';

const store = useAuthStore();
const socketStore = useSocketStore();
const roomId = computed(() => socketStore.getRoomId)
const data = computed(() => socketStore.getRoomData)

const createGame = ref<string>("");
const updateGame = ref<string>("");
const joinRoom = ref<string>("");

const config = ref<IRoomConfig>({});
const currentUser = computed(() => store.getCurrentUser);
const checkIsOwner = () => data.value.users?.some(({ email, isOwner }) => email === currentUser.value?.email && !!isOwner);

const getRoomUsers = () => data.value?.users ?? [];
const isOwner = ref(checkIsOwner())

const handleUpdateRoom = () => {
    if (!isOwner.value) {
        console.log("Vous n'êtes pas propriétaire.");
        return;
    }

    socketStore.handleUpdateRoom(roomId.value, config.value)
}

const handleStartGame = () => {
    if (!isOwner.value) {
        console.log("Vous n'êtes pas propriétaire.");
        return;
    }

    socketStore.handleStartGame(roomId.value)
}

const handleJoinRoom = () => {
    if (!currentUser.value) return;
    socketStore.handleJoinRoom(currentUser.value, joinRoom.value)
}

const handleRoomStart = () => {
    if (!currentUser.value) return;
    socketStore.handleCreateRoom(currentUser.value, createGame.value)
}

// On change users, check if I'm owner
watch(
    () => updateGame.value,
    (newVal, oldVal) => {
        if (oldVal !== newVal)
            socketStore.handleChangeGame(roomId.value, newVal)
    },
    { deep: true }
)

// On change users, check if I'm owner
watch(
    () => data.value.users,
    () =>
        isOwner.value = checkIsOwner(),
    { deep: true }
)

// On change update config in backend
watch(
    () => data.value.config,
    (newVal, oldVal) => {
        if (!oldVal || !newVal || !areObjectsEquals(oldVal, newVal))
            config.value = data.value.config ?? {}
    },
    { deep: true }
)

// On change update config in backend
watch(
    () => ({ ...config.value }),
    (newVal, oldVal) => {
        if (!areObjectsEquals(oldVal, newVal))
            handleUpdateRoom()
    },
    { deep: true }
)

onMounted(() => {
    if (data.value.config)
        config.value = data.value.config;
    if (data.value.gameName) updateGame.value = data.value.gameName
})
</script>

<template>
    <div class="fixed left-0 top-[60px] p-2 w-full max-w-[400px] h-full bg-white">
        <div v-if="!currentUser">
            <p>Veuillez vous connecter pour créer ou rejoindre une partie.</p>
        </div>
        <div v-else-if="!roomId">
            <label for="game">Créer une partie :</label>
            <select id="game" v-model="createGame">
                <option value="undercover">Undercover</option>
                <option value="speedrundle">SpeedrunDLE</option>
            </select>
            <button class="bg-green-500 text-black" @click="handleRoomStart">
                Créer !</button>
            <hr>
            <label for="joinRoom">Rejoindre la room :</label>
            <input id="joinRoom" type="text" v-model="joinRoom" placeholder="Code de la room">
            <button class="bg-green-500 text-black" @click="handleJoinRoom">
                Rejoindre !</button>
        </div>
        <div v-else class="flex flex-col gap-10 ">
            <div class="flex-1 flex flex-col gap-3">
                <h1 class="text-3xl">Configuration</h1>
                <label for="game">Créer une partie :</label>
                <select id="game" v-model="updateGame">
                    <option value="undercover">Undercover</option>
                    <option value="speedrundle">SpeedrunDLE</option>
                </select>
                <label for="maxPlayers">Nombre de joueurs maximum :</label>
                <input id="maxPlayers" type="number" :disabled="!isOwner" min="0" v-model="config.maxPlayers"
                    placeholder="Entrez le nombre maximum de joueurs">
                <button :disabled="!isOwner" class="bg-green-500 text-black" @click="handleStartGame">
                    Lancer la partie</button>
            </div>
            <div>
                <p>Partager la room : {{ roomId }}</p>
            </div>
            <div class="flex-1 flex gap-5 flex-wrap">
                <div v-for="user in getRoomUsers()"
                    class="bg-white text-black w-[150px] h-[150px] p-4 flex flex-col items-center text-center font-bold rounded shadow-lg"
                    :class="{ '!bg-red-500': currentUser?.email === user.email }">
                    <img class="w-16 h-16 rounded-full" :src="currentUser?.picture" alt="user photo" />
                    <p class="break-all">{{ user.username }} <span v-if="user.isOwner">(Owner)</span></p>
                </div>
            </div>
        </div>
    </div>
</template>