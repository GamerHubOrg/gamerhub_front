<template>
  <div>
    <span>Le vainqueur est : {{ gameData.winner }}</span>

    <table class="border-collapse">
      <tr>
        <th>Username</th>
        <th>Mots</th>
        <th>Camp</th>
        <th>Etat de fin</th>
        <th>Mot</th>
      </tr>
      <tr v-for="user in roomData.users" :key="user.id">
        <td><span :class="{ 'font-bold': currentUser.id === user.id }">{{ user.username }}</span></td>
        <td>
          <div class="flex flex-col gap-2">
            <span v-for="(word, index) in getUserWords(user)" :key="`${user.id}-${index}`">
                {{ word.word }}
            </span>
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
table, th, td {
  @apply border border-black;
}
</style>