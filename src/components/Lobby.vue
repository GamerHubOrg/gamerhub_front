<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/auth.store";
import { IRoomConfig } from "@/types/interfaces";
import { computed, ref, watch, onMounted } from 'vue';
import { useSocketStore } from '../modules/socket/socket.store';
import { useRouter } from "vue-router";
import UndercoverConfig from '@/components/undercover/UndercoverConfig.vue'

const router = useRouter();
const store = useAuthStore();
const socketStore = useSocketStore();
const roomId = computed(() => socketStore.getRoomId)
const data = computed(() => socketStore.getRoomData)

const createGame = ref<string>("undercover");
const updateGame = ref<string>("");
const joinRoom = ref<string>("");

const config = computed<IRoomConfig>(() => data.value.config ?? {});
const currentUser = computed(() => store.getCurrentUser);
const roomUsers = computed(() => data.value?.users ?? []);

const isOwner = computed(() => roomUsers.value.some(({ email, isOwner }) => email === currentUser.value?.email && !!isOwner))

const handleUpdateRoom = (conf: IRoomConfig) => {
    if (!isOwner.value) {
        console.log("Vous n'êtes pas propriétaire.");
        return;
    }
    socketStore.handleUpdateRoom(roomId.value, conf)
}

const handleStartGame = () => {
  if (!isOwner.value) {
    console.log("Vous n'êtes pas propriétaire.");
    return;
  }

  socketStore.handleStartGame(roomId.value)
}

const handleLeaveRoom = () => {
  if (!currentUser.value) return;
  socketStore.handleLeaveRoom()
  router.push('/');
}

const handleJoinRoom = () => {
  if (!currentUser.value) return;
  socketStore.handleJoinRoom(currentUser.value, joinRoom.value)
}

const handleRoomStart = () => {
  if (!currentUser.value) return;
  socketStore.handleCreateRoom(currentUser.value, createGame.value)
}

watch(
    () => updateGame.value,
    (newVal, oldVal) => {
      if (oldVal !== newVal)
        socketStore.handleChangeGame(roomId.value, newVal)
    },
    {deep: true}
)

onMounted(() => {
    if (data.value.gameName) updateGame.value = data.value.gameName
})
</script>

<template>
    <div class="fixed left-0 top-0 pt-16 p-3 w-full max-w-[400px] h-screen bg-white text-black overflow-y-auto">
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

                <UndercoverConfig 
                    v-if="data.gameName === 'undercover'" 
                    v-model="config"
                    @update="handleUpdateRoom"
                />

                {{ config }}
                
                <button 
                    :disabled="!isOwner || data.gameState === 'started'" 
                    class="bg-green-500 text-black" 
                    @click="handleStartGame"
                >
                    Lancer la partie
                </button>

                <button 
                    class="bg-red-500 text-black" 
                    @click="handleLeaveRoom"
                >
                    Quitter la room
                </button>
            </div>
            <div>
                <p>Partager la room : {{ roomId }}</p>
            </div>
            <div class="flex-1 flex gap-5 flex-wrap">
                <div 
                    v-for="user in roomUsers"
                    :key="user.id"
                    class="bg-white text-black w-[150px] h-[150px] p-4 flex flex-col items-center text-center font-bold rounded shadow-lg"
                    :class="{ '!bg-red-500': currentUser?.email === user.email }"
                >
                    <img class="w-16 h-16 rounded-full" :src="currentUser?.picture" alt="user photo" />
                    <p class="break-all">{{ user.username }} <span v-if="user.isOwner">(Owner)</span></p>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="!roomId">
      <label for="game">Créer une partie :</label>
      <select id="game" v-model="createGame">
        <option value="undercover">Undercover</option>
        <option value="speedrundle">SpeedrunDLE</option>
      </select>
      <button class="bg-green-500 text-black" @click="handleRoomStart">
        Créer !
      </button>
      <hr>
      <label for="joinRoom">Rejoindre la room :</label>
      <input id="joinRoom" type="text" v-model="joinRoom" placeholder="Code de la room">
      <button class="bg-green-500 text-black" @click="handleJoinRoom">
        Rejoindre !
      </button>
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
        <button :disabled="!isOwner || data.gameState === 'started'" class="bg-green-500 text-black"
                @click="handleStartGame">
          Lancer la partie
        </button>

        <button class="bg-red-500 text-black" @click="handleLeaveRoom">
          Quitter la room
        </button>
      </div>
      <div>
        <p>Partager la room : {{ roomId }}</p>
      </div>
      <div class="flex-1 flex gap-5 flex-wrap">
        <div v-for="user in getRoomUsers()"
             class="bg-white text-black w-[150px] h-[150px] p-4 flex flex-col items-center text-center font-bold rounded shadow-lg"
             :class="{ '!bg-red-500': currentUser?.email === user.email }">
          <img class="w-16 h-16 rounded-full" :src="currentUser?.picture" alt="user photo"/>
          <p class="break-all">{{ user.username }} <span v-if="user.isOwner">(Owner)</span></p>
        </div>
      </div>
    </div>
  </div>
</template>
