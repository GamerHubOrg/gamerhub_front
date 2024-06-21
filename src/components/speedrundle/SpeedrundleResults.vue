<template>
  <div class="text-white">
    <h1 class="text-center font-bold text-4xl">Résultats</h1>

    <div class="flex flex-col mt-12 rounded-md overflow-hidden overflow-x-auto">
      <div class="flex flex-row items-center justify-between gap-2 bg-dark2 p-3">
        <span class="w-12">Rank</span>
        <span class="w-56">Username</span>
        <div class="flex flex-row items-center justify-between gap-2 w-full">
          <span v-for="character in charactersToGuess" :key="character._id">
            {{ character.name }}
          </span>
          <span>Total</span>
        </div>
      </div>

      <div v-for="user in usersResults" :key="user._id">
        <div class="flex flex-row items-center justify-between p-3 gap-2 bg-white bg-opacity-10">
          <span class="text-3xl font-bold font-serif w-12 text-center" :class="getRankColor(user.rank)">{{ user.rank }}</span>
          <div class="flex items-center gap-x-4 text-xs w-56">
            <img :src="user.picture" alt="" class="h-6 w-6 rounded-full bg-gray-800" />
            <div class="font-medium leading-6 text-white">
              <span v-if="user._id !== currentUser._id">{{ user.username }}</span>
              <span v-else class="text-green-400">Moi</span>
            </div>
          </div>
          <div class="flex flex-row items-center justify-between gap-2 w-full">
            <span v-for="character, i in charactersToGuess" :key="character._id">
              {{ user.scores[i] }}
            </span>
            <span>{{ user.totalScore }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { User as UserInterface } from '@/modules/auth/user';
import { computed } from 'vue';
import { useSocketStore } from '../../modules/socket/socket.store';
import { useAuthStore } from '@/modules/auth/auth.store';
import {  ISpeedrundleGameData, ISpeedrundleRoomData } from './speedrundle.types';

const store = useAuthStore();
const socketStore = useSocketStore();

const currentUser = computed(() => (store.getCurrentUser as UserInterface))
const roomData = computed(() => (socketStore.getRoomData as ISpeedrundleRoomData));
const gameData = computed(() => (roomData.value.gameData as ISpeedrundleGameData));

const charactersToGuess = computed(() => gameData.value.charactersToGuess ?? []);
const usersResults = computed(() => {
  interface IUserResult {
    _id: string;
    username: string;
    picture?: string;
    scores: number[];
    totalScore: number;
    rank: number;
  }

  const results: IUserResult[] = []
  const users = roomData.value.users
  for (const { _id, username, picture } of users) {
    const answers = gameData.value.usersAnswers.find(({ playerId }) => playerId === _id);
    if (!answers) continue;
    const totalScore = answers.roundsData.reduce((prev, curr) => prev + curr.score, 0)
    results.push({ _id, username, picture, scores: answers.roundsData.map(({ score }) => score), totalScore, rank: 0 })
  }

  results.sort((a, b) => b.totalScore - a.totalScore)

  let currentRank = 1
  for (let i = 0; i < results.length; i++) {
    if (i > 0 && results[i].totalScore < results[i - 1].totalScore) {
      currentRank = i + 1
    }
    results[i].rank = currentRank
  }
  

  return results
})

function getRankColor(rank: number) {
  switch (rank) {
    case 1:
      return 'text-glow text-yellow-500';
    case 2:
      return 'text-glow text-gray-300';
    case 3:
      return 'text-glow text-yellow-600';
    default:
      return 'text-white';
  }
}
</script>

<style scoped>
table,
th,
td {
  @apply border border-black;
}

.text-glow {
  text-shadow: 0 0 8px currentColor;
}
</style>