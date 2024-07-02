<template>
  <div class="text-white">
    <h1 class="text-center font-bold text-4xl">Résultats</h1>

    <table class="w-full mt-12 rounded-md">
      <thead class="bg-dark2">
        <tr>
          <th class="py-3 rounded-tl-md">Rank</th>
          <th>Username</th>
          <th v-for="character in charactersToGuess" :key="character._id">
            {{ character.name }}
          </th>
          <th class="rounded-tr-md">Total</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user, i in usersResults" :key="user._id" class="bg-white bg-opacity-10">
          <td class="" :class="{ 'rounded-bl-md': i === usersResults.length - 1 }">
            <div class="text-3xl font-bold font-serif text-center" :class="getRankColor(user.rank)">{{ user.rank }}
            </div>
          </td>
          <td>
            <div class="flex items-center gap-x-4 text-xs w-fit mx-auto">
              <img :src="user.picture" alt="" class="h-6 w-6 rounded-full bg-gray-800" />
              <div class="font-medium leading-6 text-white">
                <span v-if="user._id !== currentUser._id">{{ user.username }}</span>
                <span v-else class="text-green-400">Moi</span>
              </div>
            </div>
          </td>
          <td v-for="character, i in charactersToGuess" :key="character._id" class="text-center">
            {{ user.scores[i] }}
          </td>
          <td class="text-center" :class="{ 'rounded-br-md': i === usersResults.length - 1 }">
            {{ user.totalScore }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-6">
      <h3 class="text-xl text-center mb-2">Détails des scores</h3>
      <div class="flex gap-5 justify-center flex-wrap mb-2">
        <div v-for="character in finishedCharactersData" class="flex flex-col items-center">
          <img v-if="!!character.image" :src="character.image" />
          <p v-if="character.abandon">Abandonné</p>
          <p v-else>{{ character.attempts }} essais</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { User as UserInterface } from '@/modules/auth/user';
import { computed } from 'vue';
import { useSocketStore } from '@/modules/socket/socket.store';
import { useAuthStore } from '@/modules/auth/auth.store';
import { ILolCharacter, IPokemonCharacter, ISpeedrundleGameData, ISpeedrundleRoomData } from './speedrundle.types';
import { formatLolCharacter, formatPokemonCharacter } from './speedrundle.functions'

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

const finishedCharactersData = computed(() => {
  const userAnswers = gameData.value.usersAnswers.find(({ playerId }) => playerId === currentUser.value._id);
  const { roundsData } = userAnswers || {};
  return charactersToGuess.value.map((character, index) => ({
    image: formatCharacter(character._id)?.sprite,
    attempts: roundsData?.[index].guesses.length || 0,
    score: roundsData?.[index].score || 0,
    abandon: !roundsData?.[index].hasFound,
  }));
});

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

function formatCharacter(id: string) {
  const characterData = gameData.value.allCharacters.find(({ _id }) => _id === id);
  if (!characterData) return undefined;

  switch (roomData.value.config?.theme) {
    case "league_of_legends":
      return formatLolCharacter(characterData as ILolCharacter);
    case "pokemon":
      return formatPokemonCharacter(characterData as IPokemonCharacter);

    default:
      break;
  }
}
</script>

<style scoped>
.text-glow {
  text-shadow: 0 0 8px currentColor;
}
</style>