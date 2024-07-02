<template>
  <div class="flex flex-col items-center gap-7">
    <h2 class="text-3xl">Speedrun Dle</h2>
    <p>
      Le thème de la partie est :
      <span class="font-semibold">{{ roomCong?.theme }} : {{ roomCong?.mode }}</span>
    </p>
    <!-- Progress Bar -->
    <div
      class="flex xl:flex-col w-[300px] h-3 xl:absolute xl:right-0 xl:bottom-1/2 xl:translate-y-1/2 xl:h-[300px] xl:w-3 bg-red-500 rounded-tl rounded-tr max-xl:rounded-bl max-xl:rounded-br">
      <span v-for="n in nbRounds" class="relative flex-1 flex items-center"
        :class="{ 'border-black max-xl:border-r-2':n < nbRounds ,'xl:border-b-2': n < nbRounds, 'bg-green-500': currentRound > n,'rounded-tl': n === 1, 'rounded-bl': n === 1, 'rounded-tr': n === nbRounds, 'rounded-br': n === nbRounds , 'xl:rounded-tl': n === 1, 'xl:rounded-bl': n === nbRounds }">

        <div v-if="allUsersCurrentRound[n - 1]" class="absolute w-6 h-6 right-full mb-10 xl:mr-2 max-xl:translate-x-3">
          <img v-if="allUsersCurrentRound[n - 1].length === 1" :key="allUsersCurrentRound[n - 1][0]"
            :src="allUsersCurrentRound[n - 1][0]" class="w-full h-full rounded-full border border-white">
          <span v-else
            class="flex items-center justify-center w-full h-full font-bold bg-white rounded-full text-black border border-white">
            {{ allUsersCurrentRound[n - 1].length }}</span>
        </div>
      </span>
    </div>

    <div v-if="playerState === 'finished'">
      <h3 class="text-xl text-center mb-2">Détails des scores</h3>
      <div class="flex gap-5 justify-center flex-wrap mb-2">
        <div v-for="character in finishedCharactersData" :key="character.id" class="flex flex-col items-center">
          <img v-if="!!character.image" :src="character.image" />
          <p v-if="character.abandon">Abandonné</p>
          <p v-else>{{ character.attempts }} essais</p>
        </div>
      </div>
      <p class="text-center">En attente des autres joueurs...</p>
    </div>
    <!-- Character Grid -->
    <div v-else class="flex flex-col items-center gap-7 max-w-[1500px] w-full mr-16 ml-16">
      <Select :value="characterGuessId" @update="handleCharacterSelect" :hide-options="true" :query-starts-with="true"
        :options="filteredCharacters" />
      <Button type="danger" @click="handleGiveUpCharacter">Abandonner ce personnage</Button>
      <div class="w-full max-xl:h-[370px] max-xl:overflow-y-auto overflow-x-auto">
        <table class="border-separate bg-dark2 w-full">
          <thead>
            <tr>
              <th v-for="column in gameData?.columns" :key="column.name">
                {{ column.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guess in reversedGuessedCharacters" :key="guess?.id">
              <th v-for="column in gameData?.columns" :class="getColumnClass(guess.id, column.key)" :key="column.key">
                <img v-if="column.type === 'image'" :src="guess[column.key as keyof object]" class="mx-auto" />
                <p v-else>{{ guess[column.key as keyof object] }}</p>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Score  -->
    <div class="flex gap-1 xl:absolute xl:top-20 xl:right-16 xl:flex-col xl:overflow-y-auto xl:h-[150px]">
      <div v-for="user in roomData.users" :key="user.socket_id" class="flex justify-center items-center">
        <div class="flex items-center gap-2 max-w-48 max-h-12 p-3 rounded-md" :class="{
          'bg-lightgrey': currentUser?.email === user.email,
          'bg-darkgrey': currentUser?.email !== user.email,
          'border border-green-500': scores[user._id]?.state === 'finished'
        }">
          <div class="max-h-12 max-w-12 text-xs truncate">
            <img :src="user.picture" class="w-full rounded-md" />
            <span class="text-xs truncate">{{ user.username }} </span>
          </div>
          <span class="font-semibold text-xs">Score : {{ scores[user._id].score }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/auth.store";
import { User } from "@/modules/auth/user";
import { useSocketStore } from "../../modules/socket/socket.store";
import { computed, ref, watch } from "vue";
import {
  ICharacter,
  ILolCharacter,
  IPokemonCharacter,
  ISpeedrundleAnswer,
  ISpeedrundleGameData,
  ISpeedrundleRoomData,
  SpeedrundleAnswerClues,
} from "./speedrundle.types";
import { formatLolCharacter, compareLolGuessToAnswer, formatPokemonCharacter, comparePokemonGuessToAnswer } from './speedrundle.functions'
import Select from "@/components/Select.vue";
import findCharacterSound from '../../assets/games/speedrundle/sounds/find-character.wav'
import giveUpCharacterSound from '../../assets/games/speedrundle/sounds/give-up-character.wav'
import Button from "../Button.vue";

const store = useAuthStore();
const socketStore = useSocketStore();

const stateData = computed(() => socketStore.getRoomData);
const roomId = computed(() => socketStore.getRoomId);
const socket = computed(() => socketStore.getSocket);
const currentUser = computed(() => store.getCurrentUser as User);
const roomData = computed(() => stateData.value as ISpeedrundleRoomData);
const roomCong = computed(() => roomData.value.config);
const gameData = computed(() => roomData.value.gameData as ISpeedrundleGameData);

const characterGuessId = ref<string>("");
const userAnswers = ref<ISpeedrundleAnswer>();

const charactersToGuess = ref<ICharacter[]>([]);
const allCharacters = ref<ICharacter[]>([]);
const playerState = computed(() => userAnswers.value?.state)
const reversedGuessedCharacters = computed(() => [...guessedCharacters.value].reverse());
const nbRounds = computed(() => roomData.value.config?.nbRounds || 0)
const currentRound = computed(() => userAnswers.value?.currentRound || 1)
const currentCharacterToGuess = computed(() => charactersToGuess.value[currentRound.value - 1]);

const allUsersCurrentRound = computed(() => {
  const rounds: string[][] = [];
  for (const { _id, picture } of roomData.value.users) {
    if (!picture) continue;
    const answers = gameData.value.usersAnswers?.find(({ playerId }) => _id === playerId);
    if (!answers || answers.state === "finished") continue;
    const roundIndex = answers.currentRound - 1
    rounds[roundIndex] = [...(rounds[roundIndex] || []), picture];
  }

  return rounds
})

const finishedCharactersData = computed(() => {
  if (playerState.value !== 'finished') return [];

  const { roundsData } = userAnswers.value || {};
  return charactersToGuess.value.map((character, index) => ({
    id: character._id,
    image: formatCharacter(character._id)?.sprite,
    attempts: roundsData?.[index].guesses.length || 0,
    score: roundsData?.[index].score || 0,
    abandon: !roundsData?.[index].hasFound
  }));
});

const guessedCharacters = computed(() => {
  if (!userAnswers.value) return [];
  const { roundsData, currentRound } = userAnswers.value;
  return (
    roundsData[currentRound - 1].guesses.map((characterId) => formatCharacter(characterId))
      .filter((e) => !!e) ?? []
  );
});

const filteredCharacters = computed(() => {
  const chars = allCharacters.value;
  if (!chars) return [];
  return chars
    .filter(({ _id }) => !guessedCharacters.value.some((e) => e.id === _id))
    .map(({ _id, name, data }) => ({ value: _id, label: name, imageUrl: data.sprite }));
});

const scores = computed(() => {
  const scoresObject: Record<string, { score: number, state: "finished" | "playing" }> = {};
  for (const { _id } of roomData.value.users) {
    const key = _id as keyof object
    const answers = gameData.value.usersAnswers?.find((e) => _id === e.playerId);
    const score = answers?.roundsData.reduce((prev, curr) => prev + curr.score, 0) || 0
    const state = answers?.state || "playing"
    scoresObject[key] = { score, state }
  }

  return scoresObject;
});


function compareGuessToAnswer(id: string, column: string): SpeedrundleAnswerClues {
  const characterData = allCharacters.value.find(({ _id }) => _id === id);
  if (!characterData || !currentCharacterToGuess.value) return "false";

  switch (roomData.value.config?.theme) {
    case "league_of_legends":
      return compareLolGuessToAnswer(currentCharacterToGuess.value as ILolCharacter, characterData as ILolCharacter, column);
    case "pokemon":
      return comparePokemonGuessToAnswer(currentCharacterToGuess.value as IPokemonCharacter, characterData as IPokemonCharacter, column);
    default:
      return "false"
  }
}

function getColumnClass(id: string, column: string) {
  const comparisonResult = compareGuessToAnswer(id, column);
  return {
    'bg-red-500': ['false', 'more', 'less'].includes(comparisonResult),
    'bg-orange-500': comparisonResult === 'partial',
    'bg-green-500': comparisonResult === 'true',
    'arrow-up': comparisonResult === 'more',
    'arrow-down': comparisonResult === 'less'
  };
}

function formatCharacter(id: string) {
  const characterData = allCharacters.value.find(({ _id }) => _id === id);
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

function handleCharacterSelect(id: string) {
  characterGuessId.value = id;
}

function handleSendCharacter() {
  socket.value?.emit(
    "game:speedrundle:guess",
    roomId.value,
    currentUser.value._id,
    characterGuessId.value
  );
  characterGuessId.value = "";
}

function handleGiveUpCharacter() {
  socket.value?.emit(
    "game:speedrundle:give-up",
    roomId.value,
    currentUser.value._id,
  );
}

function handlePlaySoundEffect(sound: string) {
  const wordAudio = new Audio(sound)
  wordAudio.volume = 0.05
  wordAudio.play();
}

socket.value?.on('game:speedrundle:give-up-character', () => handlePlaySoundEffect(giveUpCharacterSound));
socket.value?.on('game:speedrundle:find-character', () => handlePlaySoundEffect(findCharacterSound));
socket.value?.on('game:speedrundle:end-game', () => handlePlaySoundEffect(findCharacterSound));

socket.value?.on("game:speedrundle:data", ({ data }: { data: any }, target?: string) => {
  stateData.value.gameData = { ...gameData.value, ...data };

  if (!target || target === currentUser.value._id)
    userAnswers.value = gameData.value.usersAnswers?.find(
      ({ playerId }) => playerId === currentUser.value._id
    );

  if (data.allCharacters && data.allCharacters.length > 0)
    allCharacters.value = data.allCharacters ?? [];
  if (data.charactersToGuess && data.charactersToGuess.length > 0)
    charactersToGuess.value = data.charactersToGuess ?? [];
});

watch(
  () => characterGuessId.value,
  (newVal) => {
    if (newVal) handleSendCharacter();
  }
);
</script>

<style scoped>
.arrow-up,
.arrow-down {
  position: relative;
}

.arrow-up *,
.arrow-down * {
  position: relative;
  z-index: 1;
}

.arrow-up::before,
.arrow-down::before {
  content: '';
  z-index: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-repeat: no-repeat;
  background-size: 75% 75%;
  background-position: center;
  vertical-align: middle;
  opacity: 0.4;
}

.arrow-up::before {
  background-image: url('../../assets/icons/arrow-up.svg');
}

.arrow-down::before {
  background-image: url('../../assets/icons/arrow-down.svg');
}
</style>
