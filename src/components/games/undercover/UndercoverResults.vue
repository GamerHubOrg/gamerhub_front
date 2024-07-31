<template>
  <div class="text-white">
    <h1 class="text-center font-bold text-4xl">{{ gameData.campWin === 'undercover' ? 'Les espions' : 'Les civils'}} ont gagné !</h1>
    <div class="w-full max-xl:h-[370px] max-xl:overflow-y-auto overflow-x-auto">
      <table class="w-full mt-12 rounded-md overflow-hidden overflow-x-auto">
        <thead class="bg-dark2 w-full">
          <tr class="">
            <th class="min-w-48">Username</th>
            <template v-for="turn in turnsNumber" :key="turn">
              <th v-for="word in config.wordsPerTurn" :key="word" class="min-w-48 text-center w-60">
                Mot {{ word }}
              </th>
              <th class="min-w-48 text-center">
                Vote {{ turn }}
              </th>
            </template>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colspan="100" class="bg-green-500 bg-opacity-20">
              <div class="p-3 flex flex-row items-center gap-2">
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
            </td>
          </tr>
          <tr v-for="user in civilianUsers" class="bg-green-500 bg-opacity-10">
            <td class="p-2 flex justify-start items-center gap-4 border-none">
              <img :src="user.picture" alt="" class="aspect-square rounded-full max-h-14 bg-gray-800" />
              <div class="font-medium leading-6 text-white">
                <span v-if="user._id !== currentUser._id">{{ user.username }}</span>
                <span v-else class="text-red-400">Moi</span>
              </div>
            </td>
            <template class="" v-for="turn in turnsNumber" :key="turn">
              <td class="text-center px-8"
                v-for="word in config.wordsPerTurn" :key="word">
                {{ getUserWord(user, turn - 1, word - 1) }}
              </td>
              <td class="text-center font-bold"> 
                {{ getUserVote(user, turn - 1) }}</td>
            </template>
          </tr>
          <tr>
            <td colspan="100" class=" bg-red-500 bg-opacity-20">
              <div class="p-3 flex flex-row items-center gap-3">
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
            </td>
          </tr>
          <tr v-for="user in spyUsers" :key="user._id" class="bg-red-500 bg-opacity-10">
            <td class="p-2 flex justify-start items-center gap-4 border-none">
              <img :src="user.picture" alt="" class="aspect-square rounded-full max-h-14" />
              <div class="font-medium leading-6 text-white">
                <span v-if="user._id !== currentUser._id">{{ user.username }}</span>
                <span v-else class="text-red-400">Moi</span>
              </div>
            </td>
            <template v-for="turn in turnsNumber" :key="turn">
              <td class="text-center"
                v-for="word in config.wordsPerTurn" :key="word">
                {{ getUserWord(user, turn - 1, word - 1) }}
              </td>
              <td class="text-center font-bold"> 
                {{ getUserVote(user, turn - 1) }}</td>
            </template>
          </tr>
        </tbody>
      </table>
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