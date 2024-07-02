<template>
  <div class="text-white">
    <h1 class="text-center font-bold text-4xl">{{ gameData.campWin === 'undercover' ? 'Undercover win' : 'Civilian win'
      }} !</h1>

    <div class="flex flex-col mt-12 rounded-md overflow-hidden overflow-x-auto">
      <div class="flex flex-row items-center justify-between gap-2 bg-dark2 p-3">
        <span class="w-56">Username</span>
        <div v-for="turn in turnsNumber" :key="turn" class="flex flex-row items-center justify-between gap-2 w-full">
          <span v-for="word in config.wordsPerTurn" :key="word" class="text-center w-60">
            Mot {{ word }}
          </span>
          <span class="text-center w-60">
            Vote {{ turn }}
          </span>
        </div>
      </div>

      <div>
        <div class="bg-green-500 bg-opacity-20 p-3 flex flex-row items-center gap-2">
          <TrophyIcon v-if="gameData.campWin === 'civilian'" class="w-5 text-yellow-400" />
          <span class="text-green-400 font-bold text-lg">Civilians</span>
          <span>-</span>
          <span v-if="config.mode === 'words'">{{ gameData.civilianWord }}</span>
          <button v-else-if="config.mode === 'images'"
            class="bg-green-500 bg-opacity-50 text-green-950 p-2 rounded-md text-sm"
            @click="() => handleShowImage(gameData.civilianWord)">
            Voir l'image
          </button>
        </div>
        <div v-for="user in civilianUsers" :key="user._id">
          <div class="flex flex-row items-center justify-between p-3 bg-green-500 bg-opacity-10">
            <div class="flex items-center gap-x-4 text-xs w-56">
              <img :src="user.picture" alt="" class="h-6 w-6 rounded-full bg-gray-800" />
              <div class="font-medium leading-6 text-white">
                <span v-if="user._id !== currentUser._id">{{ user.username }}</span>
                <span v-else class="text-green-400">Moi</span>
              </div>
            </div>
            <div v-for="turn in turnsNumber" :key="turn"
              class="flex flex-row items-center justify-between gap-2 w-full">
              <span v-for="word in config.wordsPerTurn" :key="word" class="text-center w-60">
                {{ getUserWord(user, turn - 1, word - 1) }}
              </span>
              <span class="text-center w-60">
                {{ getUserVote(user, turn - 1) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="bg-red-500 bg-opacity-20 p-3 flex flex-row items-center gap-3">
          <TrophyIcon v-if="gameData.campWin === 'undercover'" class="w-5 text-yellow-400" />
          <span class="text-red-400 font-bold text-lg">Spies</span>
          <span>-</span>
          <span v-if="config.mode === 'words'">{{ gameData.spyWord }}</span>
          <button v-else-if="config.mode === 'images'"
            class="bg-red-500 bg-opacity-50 text-red-950 p-2 rounded-md text-sm"
            @click="() => handleShowImage(gameData.spyWord)">
            Voir l'image
          </button>
        </div>
        <div v-for="user in spyUsers" :key="user._id">
          <div class="flex flex-row items-center justify-between p-3 bg-red-500 bg-opacity-10">
            <div class="flex items-center gap-x-4 text-xs w-56">
              <img :src="user.picture" alt="" class="h-6 w-6 rounded-full bg-gray-800" />
              <div class="font-medium leading-6 text-white">
                <span v-if="user._id !== currentUser._id">{{ user.username }}</span>
                <span v-else class="text-red-400">Moi</span>
              </div>
            </div>
            <div v-for="turn in turnsNumber" :key="turn"
              class="flex flex-row items-center justify-between gap-2 w-full">
              <span v-for="word in config.wordsPerTurn" :key="word" class="w-60 text-center">
                {{ getUserWord(user, turn - 1, word - 1) }}
              </span>
              <span class="w-60 text-center">
                {{ getUserVote(user, turn - 1) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-if="config.mode === 'images'" :open="showImageModalOpen" @close="showImageModalOpen = false">
      <img :src="selectedWord" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { User as UserInterface } from '@/modules/auth/user';
import { computed, ref, watch } from 'vue';
import { useAuthStore } from '@/modules/auth/auth.store';
import { IUndercoverConfig, IUndercoverGameData, IUndercoverRoomData } from './undercover.types';
import { TrophyIcon } from '@heroicons/vue/24/solid'
import { useSocketStore } from '@/modules/socket/socket.store';
import Modal from '@/components/Modal.vue';

const store = useAuthStore();
const socketStore = useSocketStore();
const currentUser = computed(() => (store.getCurrentUser as UserInterface))
const roomData = computed(() => (socketStore.getRoomData as IUndercoverRoomData));
const gameData = computed(() => (roomData.value.gameData as IUndercoverGameData));
const config = computed(() => (roomData.value.config as IUndercoverConfig));

const userIdsThatPlayed = computed(() => [...new Set(gameData.value.words.map((w) => w.playerId))]);
const turnsNumber = computed(() => Math.ceil(((gameData.value.words?.length || 0) / userIdsThatPlayed.value.length) / config.value.wordsPerTurn))
const selectedWord = ref('');
const showImageModalOpen = ref(false);

const gameUsers = ref([]);

const civilianUsers = computed(() => gameUsers.value.filter((u) => !gameData.value.undercoverPlayerIds?.includes(u._id)));
const spyUsers = computed(() => gameUsers.value.filter((u) => gameData.value.undercoverPlayerIds?.includes(u._id)));

function getUserWord(user: UserInterface, turn: number, wordIndex: number) {
  const words = gameData.value.words?.filter((word) => word.playerId === user?._id);
  const index = (turn * config.value.wordsPerTurn) + wordIndex;
  return words[index]?.word || '';
}

function getUserVote(user: UserInterface, voteIndex: number) {
  const votes = gameData.value?.votes?.filter((vote) => vote.playerId === user?._id);
  const votedUserId = votes[voteIndex]?.vote;
  return gameUsers.value.find((u) => u._id === votedUserId)?.username || '';
}

async function fetchUsers() {
  const requests = userIdsThatPlayed.value.map((userId) => store.fetchUser(userId as string));
  const result = (await Promise.allSettled(requests) as [])?.filter((req) => req.status === 'fulfilled');
  gameUsers.value = result.map((req) => req.value) as [];
}

function handleShowImage(word: string) {
  selectedWord.value = word;
  showImageModalOpen.value = true;
}

watch(
  () => gameData.value,
  () => {
    fetchUsers();
  },
  { immediate: true }
)
</script>

<style scoped>
table,
th,
td {
  @apply border border-black;
}
</style>