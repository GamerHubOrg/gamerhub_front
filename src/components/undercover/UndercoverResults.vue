<template>
  <div class="text-white">
    <h1 class="text-center font-bold text-4xl">{{ gameData.campWin === 'undercover' ? 'Undercover win' : 'Civilian win' }} !</h1>

    <div class="flex flex-col mt-12 rounded-md overflow-hidden overflow-x-auto">
      <div class="flex flex-row items-center justify-between gap-2 bg-dark2 p-3">
        <span>Username</span>
        <div 
          v-for="turn in (gameData.words?.length / userIdsThatPlayed?.length) / config.wordsPerTurn" 
          :key="turn"
          class="flex flex-row items-center justify-between gap-2 w-full"
        >
          <span 
            v-for="word in config.wordsPerTurn" 
            :key="word"
            class="w-full text-center"
          >
            Mot {{ word }}
          </span>
          <span 
            class="w-full text-center"
          >
            Vote {{ turn }}
          </span>
        </div>
      </div>

      <div>
        <div v-for="user in civilianUsers" :key="user._id">
          <div 
            class="flex flex-row items-center justify-between p-3" 
            :class="{
              'bg-green-500 bg-opacity-10':!gameData.undercoverPlayerIds?.includes(user._id),
              'bg-red-500 bg-opacity-10': gameData.undercoverPlayerIds?.includes(user._id),
            }"
          >
            <div class="flex items-center gap-x-4 text-xs">
              <img :src="user.picture" alt="" class="h-6 w-6 rounded-full bg-gray-800" />
              <div class="truncate font-medium leading-6 text-white">
                <span>{{ user.username }}</span>
              </div>
            </div>
            <div 
              v-for="turn in ((gameData.words?.length || 0) / userIdsThatPlayed?.length) / config.wordsPerTurn" 
              :key="turn"
              class="flex flex-row items-center justify-between gap-2 w-full"
            >
              <span
                v-for="word in config.wordsPerTurn" 
                :key="word"
                class="w-full text-center"
              >
                {{ getUserWord(user, word - 1) }}
              </span>
              <span 
                class="w-full text-center"
              >
              {{ getUserVote(user, turn - 1) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div v-for="user in spyUsers" :key="user._id">
          <div 
            class="flex flex-row items-center justify-between p-3" 
            :class="{
              'bg-green-500 bg-opacity-10':!gameData.undercoverPlayerIds?.includes(user._id),
              'bg-red-500 bg-opacity-10': gameData.undercoverPlayerIds?.includes(user._id),
            }"
          >
            <div class="flex items-center gap-x-4 text-xs">
              <img :src="user.picture" alt="" class="h-6 w-6 rounded-full bg-gray-800" />
              <div class="truncate font-medium leading-6 text-white">
                <span>{{ user.username }}</span>
              </div>
            </div>
            <div 
              v-for="turn in ((gameData.words?.length || 0) / userIdsThatPlayed?.length) / config.wordsPerTurn" 
              :key="turn"
              class="flex flex-row items-center justify-between gap-2 w-full"
            >
              <span
                v-for="word in config.wordsPerTurn" 
                :key="word"
                class="w-full text-center"
              >
                {{ getUserWord(user, word - 1) }}
              </span>
              <span 
                class="w-full text-center"
              >
              {{ getUserVote(user, turn - 1) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User as UserInterface } from '@/modules/auth/user';
import { computed, ref, watch } from 'vue';
import { useSocketStore } from '../../modules/socket/socket.store';
import { useAuthStore } from '@/modules/auth/auth.store';
import { IUndercoverConfig, IUndercoverGameData, IUndercoverRoomData } from './undercover.types';

const store = useAuthStore();
const socketStore = useSocketStore();

const currentUser = computed(() => (store.getCurrentUser as UserInterface))
const roomData = computed(() => (socketStore.getRoomData as IUndercoverRoomData));
const gameData = computed(() => (roomData.value.gameData as IUndercoverGameData));
const config = computed(() => (roomData.value.config as IUndercoverConfig));
const userIdsThatPlayed = computed(() => [...new Set(gameData.value?.words.map((w) => w.playerId))]);

const gameUsers = ref([]);

const civilianUsers = computed(() => gameUsers.value.filter((u) => !gameData.value.undercoverPlayerIds?.includes(u._id)));
const spyUsers = computed(() => gameUsers.value.filter((u) => gameData.value.undercoverPlayerIds?.includes(u._id)));

function getUserWord(user: UserInterface, wordIndex: number) {
  const words = gameData.value?.words?.filter((word) => word.playerId === user?._id);
  return words[wordIndex]?.word;
}

function getUserVote(user: UserInterface, voteIndex: number) {
  const votes = gameData.value?.votes?.filter((vote) => vote.playerId === user?._id);
  const votedUserId = votes[voteIndex]?.vote;
  return gameUsers.value.find((u) => u._id === votedUserId)?.username || 'unknown';
}

async function fetchUsers() {
  const requests = userIdsThatPlayed.value.map((userId) => store.fetchUser(userId as string));
  const result = (await Promise.allSettled(requests) as [])?.filter((req) => req.status === 'fulfilled');
  gameUsers.value = result.map((req) => req.value) as [];
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
table, th, td {
  @apply border border-black;
}
</style>