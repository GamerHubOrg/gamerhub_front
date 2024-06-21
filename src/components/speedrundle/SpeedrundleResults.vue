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

          <!-- <div v-for="turn in turnsNumber" :key="turn" class="flex flex-row items-center justify-between gap-2 w-full">
            <span v-for="word in config.wordsPerTurn" :key="word" class="text-center w-60">
              {{ getUserWord(user, turn - 1, word - 1) }}
            </span>
            <span class="text-center w-60">
              {{ getUserVote(user, turn - 1) }}
            </span>
          </div> -->
        </div>
      </div>
    </div>

    <!-- <div>

        
      
      <div>
        <div class="bg-red-500 bg-opacity-20 p-3 flex flex-row items-center gap-3">
          <TrophyIcon v-if="gameData.campWin === 'undercover'" class="w-5 text-yellow-400" />
          <span class="text-red-400 font-bold text-lg">Spies</span>
          <span>-</span>
          <span v-if="config.mode === 'words'">{{ gameData.spyWord }}</span>
          <button 
            v-else-if="config.mode === 'images'" 
            class="bg-red-500 bg-opacity-50 text-red-950 p-2 rounded-md text-sm" 
            @click="() => handleShowImage(gameData.spyWord)"
          >
            Voir l'image
          </button>        </div>
        <div v-for="user in spyUsers" :key="user._id">
          <div 
            class="flex flex-row items-center justify-between p-3 bg-red-500 bg-opacity-10" 
          >
            <div class="flex items-center gap-x-4 text-xs w-56">
              <img :src="user.picture" alt="" class="h-6 w-6 rounded-full bg-gray-800" />
              <div class="font-medium leading-6 text-white">
                <span v-if="user._id !== currentUser._id">{{ user.username }}dsada sdadsa dsad</span>
                <span v-else class="text-red-400">Moi</span>
              </div>
            </div>
            <div 
              v-for="turn in turnsNumber" 
              :key="turn"
              class="flex flex-row items-center justify-between gap-2 w-full"
            >
              <span
                v-for="word in config.wordsPerTurn" 
                :key="word"
                class="w-60 text-center"
              >
                {{ getUserWord(user, turn - 1, word - 1) }}
              </span>
              <span 
                class="w-60 text-center"
              >
                {{ getUserVote(user, turn - 1) }}
              </span>
            </div>
          </div>
        </div>
      </div>-->
    <!-- </div> -->
    <!-- <Modal v-if="config.mode === 'images'" :open="showImageModalOpen" @close="showImageModalOpen = false">
        <img :src="selectedWord" />
    </Modal>  -->
  </div>

</template>

<script setup lang="ts">
import { User as UserInterface } from '@/modules/auth/user';
import { computed, ref, watch } from 'vue';
import { useSocketStore } from '../../modules/socket/socket.store';
import { useAuthStore } from '@/modules/auth/auth.store';
import { TrophyIcon } from '@heroicons/vue/24/solid'
// import Modal from '../Modal.vue';
import { ISpeedrundleConfig, ISpeedrundleGameData, ISpeedrundleRoomData } from './speedrundle.types';

const store = useAuthStore();
const socketStore = useSocketStore();

const currentUser = computed(() => (store.getCurrentUser as UserInterface))
const roomData = computed(() => (socketStore.getRoomData as ISpeedrundleRoomData));
const gameData = computed(() => (roomData.value.gameData as ISpeedrundleGameData));
const config = computed(() => (roomData.value.config as ISpeedrundleConfig));

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

  const fakeResults = [
    { _id: 'fake1', username: 'Fake User 1', picture: 'https://www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg', scores: [300, 450, 900, 755], totalScore: [300, 450, 900, 755].reduce((prev,curr) => prev+curr, 0), rank: 0 },
    { _id: 'fake2', username: 'Fake User 2', picture: 'https://www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg', scores: [458, 781, 921, 801], totalScore: [458, 781, 921, 801].reduce((prev,curr) => prev+curr, 0), rank: 0 },
    { _id: 'fake3', username: 'Fake User 3', picture: 'https://www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg', scores: [956, 121, 745, 910], totalScore: [956, 121, 745, 910].reduce((prev,curr) => prev+curr, 0), rank: 0 }
  ];
  
  results.push(...fakeResults);

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


// const userIdsThatPlayed = computed(() => [...new Set(gameData.value.words.map((w) => w.playerId))]);
// const turnsNumber = computed(() => Math.ceil(((gameData.value.words?.length || 0) / userIdsThatPlayed.value.length) / config.value.wordsPerTurn))


// const selectedWord = ref('');
// const showImageModalOpen = ref(false);

// const gameUsers = ref([]);

// const civilianUsers = computed(() => gameUsers.value.filter((u) => !gameData.value.undercoverPlayerIds?.includes(u._id)));
// const spyUsers = computed(() => gameUsers.value.filter((u) => gameData.value.undercoverPlayerIds?.includes(u._id)));

// function getUserWord(user: UserInterface, turn: number, wordIndex: number) {
//   const words = gameData.value.words?.filter((word) => word.playerId === user?._id);
//   const index = (turn * config.value.wordsPerTurn) + wordIndex;
//   return words[index]?.word || '';
// }

// function getUserVote(user: UserInterface, voteIndex: number) {
//   const votes = gameData.value?.votes?.filter((vote) => vote.playerId === user?._id);
//   const votedUserId = votes[voteIndex]?.vote;
//   return gameUsers.value.find((u) => u._id === votedUserId)?.username || '';
// }

// async function fetchUsers() {
//   const requests = userIdsThatPlayed.value.map((userId) => store.fetchUser(userId as string));
//   const result = (await Promise.allSettled(requests) as [])?.filter((req) => req.status === 'fulfilled');
//   gameUsers.value = result.map((req) => req.value) as [];
// }

// function handleShowImage(word: string) {
//   selectedWord.value = word;
//   showImageModalOpen.value = true;
// }

// watch(
//   () => gameData.value,
//   () => {
//     fetchUsers();
//   },
//   { immediate: true }
// )
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