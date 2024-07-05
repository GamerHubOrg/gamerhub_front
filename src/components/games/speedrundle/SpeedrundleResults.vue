<template>
  <div class="text-white">
    <h1 class="text-center font-bold text-4xl">Résultats</h1>

    <SpeedrundleResultsTable
      :users-answers="gameData.usersAnswers"
      :users="roomData.users"
      :characters-to-guess="charactersToGuess"
    />

    <div class="mt-6">
      <h3 class="text-xl text-center mb-2">Détails des scores</h3>
      <div class="flex gap-5 justify-center flex-wrap mb-2">
        <div
          v-for="character in finishedCharactersData"
          class="flex flex-col items-center"
        >
          <img v-if="!!character.image" :src="character.image" />
          <p v-if="character.abandon">Abandonné</p>
          <p v-else>{{ character.attempts }} essais</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User as UserInterface } from "@/modules/auth/user";
import { computed } from "vue";
import { useSocketStore } from "@/modules/socket/socket.store";
import { useAuthStore } from "@/modules/auth/auth.store";
import {
  ISpeedrundleGameData,
  ISpeedrundleRoomData,
} from "./speedrundle.types";
import { formatCharacter } from "./speedrundle.functions";
import SpeedrundleResultsTable from "./components/SpeedrundleResultsTable.vue";

const store = useAuthStore();
const socketStore = useSocketStore();

const currentUser = computed(() => store.getCurrentUser as UserInterface);
const roomData = computed(
  () => socketStore.getRoomData as ISpeedrundleRoomData
);
const gameData = computed(
  () => roomData.value.gameData as ISpeedrundleGameData
);

const charactersToGuess = computed(
  () => gameData.value.charactersToGuess ?? []
);

const finishedCharactersData = computed(() => {
  const userAnswers = gameData.value.usersAnswers.find(
    ({ playerId }) => playerId === currentUser.value._id
  );
  const { roundsData } = userAnswers || {};
  return charactersToGuess.value.map((character, index) => ({
    image: formatCharacter(
      gameData.value.allCharacters,
      roomData.value.config?.theme!,
      character._id
    )?.sprite,
    attempts: roundsData?.[index].guesses.length || 0,
    score: roundsData?.[index].score || 0,
    abandon: !roundsData?.[index].hasFound,
  }));
});
</script>
