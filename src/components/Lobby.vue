<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/auth.store";
import { IRoomConfig } from "@/types/interfaces";
import { computed, ref, watch, onMounted } from 'vue';
import { useSocketStore } from '../modules/socket/socket.store';
import { useRouter } from "vue-router";
import UndercoverConfig from '@/components/undercover/UndercoverConfig.vue'
import SpeedrundleConfig from '@/components/speedrundle/SpeedrundleConfig.vue'
import { useGamesStore } from "@/modules/games/games.store";
import { toast } from 'vue3-toastify';
import Modal from '@/components/Modal.vue';
import { DialogTitle } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

const router = useRouter();
const store = useAuthStore();
const socketStore = useSocketStore();
const gameStore = useGamesStore();
const roomId = computed(() => socketStore.getRoomId)
const data = computed(() => socketStore.getRoomData)

const roomCodeTimer = ref<NodeJS.Timeout | undefined>(undefined)
const roomCodeStatus = ref<string>("Copy")
const createGame = ref<string>("undercover");
const updateGame = ref<string>("");
const joinRoom = ref<string>("");
const shareConfigName = ref<string>("");

const config = computed(() => data.value.config ?? {});
const currentUser = computed(() => store.getCurrentUser);
const roomUsers = computed(() => data.value?.users ?? []);

const publishConfigModalOpen = ref(false);
const isOwner = computed(() => roomUsers.value.some(({ email, isOwner }) => email === currentUser.value?.email && !!isOwner))

const handleOpenLobby = () => {
  gameStore.setIsLobbyCollapsed(true);
}

const handleCopyRoomCode = () => {
    if(roomCodeTimer.value) clearTimeout(roomCodeTimer.value)
    roomCodeStatus.value = "Copied";
    navigator.clipboard.writeText(roomId.value);
    roomCodeTimer.value = setTimeout(() => roomCodeStatus.value = 'Copy', 1200)
}

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
  gameStore.setIsLobbyCollapsed(true);
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
  updateGame.value = createGame.value;
}

const handleShareConfig = async (e) => {
    try {
        e.preventDefault();
        await gameStore.publishConfig({ game: data.value.gameName, name: shareConfigName.value, config: config.value});
        shareConfigName.value = "";
        publishConfigModalOpen.value = false
        toast("Config plublished successfully !", {
            autoClose: 1000,
            type: 'success',
            theme: 'dark'
        });
    } catch(err) {
        console.log(err);
    }
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
    <div class="fixed left-0 top-0 p-6 h-full bg-dark2 z-50 w-full overflow-y-auto max-w-[480px]">
        <div class="flex flex-row items-center justify-between mb-5">
            <h3 class="text-white text-2xl font-bold">Game Room</h3>
            <button class="rounded bg-white bg-opacity-10 text-white p-2 text-sm" @click="handleOpenLobby">
                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 1.5L1 13.5M1 1.5L13 13.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>

        <div v-if="!currentUser" class="flex items-center justify-center flex-col gap-4 text-white opacity-30 mt-20">
            <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="white">
                <path d="M40.1 467.1l-11.2 9c-3.2 2.5-7.1 3.9-11.1 3.9C8 480 0 472 0 462.2V192C0 86 86 0 192 0S384 86 384 192V462.2c0 9.8-8 17.8-17.8 17.8c-4 0-7.9-1.4-11.1-3.9l-11.2-9c-13.4-10.7-32.8-9-44.1 3.9L269.3 506c-3.3 3.8-8.2 6-13.3 6s-9.9-2.2-13.3-6l-26.6-30.5c-12.7-14.6-35.4-14.6-48.2 0L141.3 506c-3.3 3.8-8.2 6-13.3 6s-9.9-2.2-13.3-6L84.2 471c-11.3-12.9-30.7-14.6-44.1-3.9zM160 192a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
            </svg>
            <span>You need to be authenticated in order to play games</span>
        </div>

        <div v-else-if="!roomId" class="flex flex-col gap-8">
            <div class="flex flex-col gap-5">
                <h5 class="w-full text-center font-bold text-lg text-white">New room</h5>
                <div class="border border-dark3 rounded p-2 flex flex-row items-center gap-2 text-white">
                    <label for="game" class="whitespace-nowrap font-semibold">Mode de jeu :</label>
                    <select id="game" class="bg-transparent w-full" v-model="createGame">
                        <option value="undercover">Undercover</option>
                        <option value="speedrundle">SpeedrunDLE</option>
                    </select>
                </div>
                <button 
                    class="w-full bg-[#00A569] rounded-xl p-3 text-sm"
                    @click="handleRoomStart"
                >
                    Create
                </button>
            </div>

            <div class="flex flex-row gap-4 items-center text-white text-opacity-15">
                <span class="w-full h-[1px] bg-white bg-opacity-15"></span>
                <span>or</span>
                <span class="w-full h-[1px] bg-white bg-opacity-15"></span>
            </div>

            <div class="flex flex-col gap-5">
                <h5 class="w-full text-center font-bold text-lg text-white">Existing room</h5>

                <input 
                    v-model="joinRoom" 
                    type="text" 
                    placeholder="98DH46Z"
                    class="bg-white bg-opacity-5 rounded-2xl p-4 text-white"
                />

                <button 
                    class="w-full bg-[#00A569] rounded-xl p-3 text-sm"
                    @click="handleJoinRoom"
                >
                    Join
                </button>
            </div>
        </div>

        <div v-else class="flex flex-col justify-between h-full">
            <div class="flex flex-col gap-5">
                <div class="flex flex-col bg-white bg-opacity-5 rounded-2xl p-4 gap-4">
                    <div 
                        v-for="user in roomUsers"
                        class="bg-white bg-opacity-[6%] rounded-lg p-4 flex flex-row items-center justify-between"
                        :key="user.id"
                    >
                        <div class="flex flex-row items-center gap-3">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 19C17 17.4087 16.3679 15.8826 15.2426 14.7574C14.1174 13.6321 12.5913 13 11 13M11 13C9.4087 13 7.88258 13.6321 6.75736 14.7574C5.63214 15.8826 5 17.4087 5 19M11 13C13.2091 13 15 11.2091 15 9C15 6.79086 13.2091 5 11 5C8.79086 5 7 6.79086 7 9C7 11.2091 8.79086 13 11 13ZM21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <div class="truncate text-white flex flex-row items-center gap-2">
                                <span>{{ user.username }}</span>
                                <span v-if="user.isOwner">
                                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 17H18M1 1L4 13H18L21 1L15 8L11 1L7 8L1 1Z" stroke="#E8B914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div v-if="isOwner && user.id !== currentUser.id" class="flex flex-row gap-2">
                            <button class="bg-[#E8B9141A] text-[#E8B914] rounded-lg px-3 py-1.5 text-sm">Promote</button>
                            <button class="bg-[#E847471A] text-[#E84747] rounded-lg px-3 py-1.5 text-sm">Kick</button>
                        </div>
                    </div>
                </div>

                <h5 class="w-full text-center font-bold text-lg text-white">Settings</h5>

                <div class="border border-dark3 rounded p-2 flex flex-row items-center gap-2 text-white">
                    <label for="game" class="whitespace-nowrap font-semibold">Change game :</label>
                    <select id="game" class="bg-transparent w-full" v-model="updateGame">
                        <option value="undercover">Undercover</option>
                        <option value="speedrundle">SpeedrunDLE</option>
                    </select>
                </div>

                <UndercoverConfig 
                    v-if="data.gameName === 'undercover'" 
                    :config="config"
                    @update="handleUpdateRoom"
                />
                <SpeedrundleConfig 
                    v-else-if="data.gameName === 'speedrundle'" 
                    :config="config"
                    @update="handleUpdateRoom"
                />
            </div>

            <div class="flex flex-col gap-4 text-white mt-20">
                <div class="flex flex-row justify-between items-center bg-white bg-opacity-5 rounded-2xl p-4">
                    <span class="font-semibold text-2xl">{{ roomId }}</span>
                    <div 
                        class="flex flex-row items-center gap-2 bg-white bg-opacity-10 rounded-lg p-2 cursor-pointer"
                        @click="handleCopyRoomCode"
                    >
                        <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 15C1.9 15 1 14.1 1 13V3C1 1.9 1.9 1 3 1H13C14.1 1 15 1.9 15 3M9 7H19C20.1046 7 21 7.89543 21 9V19C21 20.1046 20.1046 21 19 21H9C7.89543 21 7 20.1046 7 19V9C7 7.89543 7.89543 7 9 7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="text-sm">{{ roomCodeStatus }}</span>
                    </div>
                </div>

                <div class="flex flex-row justify-between items-center gap-4">
                    <button 
                        class="w-full bg-[#E84747] rounded-xl p-3 text-sm"
                        @click="handleLeaveRoom"
                    >
                        Leave room
                    </button>
                    <button 
                        class="w-full bg-[#00A569] rounded-xl p-3 text-sm"
                        @click="handleStartGame"
                    >
                        Start
                    </button>
                </div>

                <button class="w-full bg-dark5 flex flex-row items-center justify-center gap-2 rounded-xl p-3 mb-6" @click="publishConfigModalOpen = true">
                    <svg width="18" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V11M13 5L9 1M9 1L5 5M9 1V14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Share
                </button>
            </div>
        </div>
    </div>
    <Modal 
        :open="publishConfigModalOpen" 
        @close="publishConfigModalOpen = false" 
    >
        <form @submit="handleShareConfig">
            <div>
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-dark5">
                    <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-white">Give this config a name !</DialogTitle>
                    <div class="mt-10">
                        <input v-model="shareConfigName" required type="text" class="block w-full p-1.5 rounded-md border-0 bg-dark5 shadow-sm ring-1 ring-inset ring-dark3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" placeholder="Config name here..." />
                    </div>
                </div>
            </div>
            <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button type="submit" class="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:col-start-2">Share</button>
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0" @click="publishConfigModalOpen = false" ref="cancelButtonRef">Cancel</button>
            </div>
        </form>
    </Modal>
</template>
