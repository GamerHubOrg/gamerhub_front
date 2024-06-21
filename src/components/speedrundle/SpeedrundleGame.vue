<template>
  <div class="flex flex-col items-center gap-7">
    <h2 class="text-3xl">Speedrun Dle</h2>
    <p>
      Le thème de la partie est :
      <span class="font-semibold">{{ roomCong?.theme }} : {{ roomCong?.mode }}</span>
    </p>

    <div class="absolute right-0 flex flex-col gap-1">
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

    <div v-if="playerState === 'finished'">
      <h3 class="text-xl text-center mb-2">Détails des scores</h3>
      <div class="flex gap-5 justify-center flex-wrap mb-2">
        <div v-for="character in finishedCharactersData" class="flex flex-col items-center">
          <img v-if="!!character.image" :src="character.image" />
          <p>{{ character.attempts }} essais</p>
        </div>
      </div>
      <p class="text-center">En attente des autres joueurs...</p>
    </div>

    <div v-else class="flex flex-col items-center gap-7 max-w-[1500px] w-full">
      <Select :value="characterGuessId" @update="handleCharacterSelect" :hide-options="true" :query-starts-with="true"
        :options="filteredCharacters" />
      <div class="w-full">
        <table class="border-separate bg-dark2 w-full">
          <thead>
            <tr>
              <th v-for="column in gameData?.columns">
                {{ column.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guess in guessedCharacters.reverse()">
              <th v-for="column in gameData?.columns" :class="getColumnClass(guess.id, column.key)">
                <img v-if="column.type === 'image'" :src="guess[column.key as keyof object]" class="mx-auto" />
                <p v-else>{{ guess[column.key as keyof object] }}</p>
              </th>
            </tr>
          </tbody>
        </table>
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
  ISpeedrundleAnswer,
  ISpeedrundleGameData,
  ISpeedrundleRoomData,
} from "./speedrundle.types";
import Select from "@/components/Select.vue";
import { capitalizeFirstLetter } from "../../utils/functions";

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
const charactersToGuess = computed(() => gameData.value.charactersToGuess ?? []);
const allCharacters = ref<ICharacter[]>([]);

const userAnswers = ref<ISpeedrundleAnswer>();

const playerState = computed(() => userAnswers.value?.state)

const currentCharacterToGuess = computed(() => {
  if (!userAnswers.value) return undefined;
  const { currentRound } = userAnswers.value;
  return charactersToGuess.value[currentRound - 1];
});

const finishedCharactersData = computed(() => {
  if (playerState.value !== 'finished') return [];

  const { roundsData } = userAnswers.value || {};
  return charactersToGuess.value.map((character, index) => ({
    image: formatCharacter(character._id)?.sprite,
    attempts: roundsData?.[index].guesses.length || 0,
    score: roundsData?.[index].score || 0
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

function verifyArrayInclusion(array1: string[], array2: string[]) {
  const allGood =
    array1.every((tag) => array2.includes(tag)) &&
    array2.every((tag) => array1.includes(tag));
  if (allGood) return "true";
  const someGood = allGood || array1.some((tag) => array2?.includes(tag));
  if (someGood) return "partial";
  return "false";
}

function getLolColumnClass(characterData: ILolCharacter, column: string) {
  const arraysColumns = ["tags", "range", "position"];
  const stringColumns = ["ressource", "gender"];
  const red = "bg-red-500";
  const green = "bg-green-500";
  const orange = "bg-orange-500";

  if (arraysColumns.includes(column)) {
    const guess = characterData.data[column as keyof object];
    const toGuess = currentCharacterToGuess.value?.data[column as keyof object] ?? [];
    const value = verifyArrayInclusion(toGuess, guess);
    return value === "true"
      ? green
      : value === "partial"
        ? orange
        : red;
  }

  if (stringColumns.includes(column)) {
    const guess = characterData.data[column as keyof object];
    const toGuess = currentCharacterToGuess.value?.data[column as keyof object];
    return guess === toGuess ? green : red;
  }

  return characterData._id === currentCharacterToGuess.value?._id
    ? green
    : red;
}

function getColumnClass(id: string, column: string) {
  const characterData = gameData.value.allCharacters.find(({ _id }) => _id === id) as
    | ILolCharacter
    | undefined;
  if (!characterData) return "bg-red-500";

  switch (roomData.value.config?.theme) {
    case "league_of_legends":
      return getLolColumnClass(characterData, column);

    default:
      break;
  }
}

function formatLolCharacter(characterData: ILolCharacter) {
  const sprite = characterData.data.sprite;
  const { ressource } = characterData.data;
  const gender =
    characterData.data.gender === "male"
      ? "Masculin"
      : characterData.data.gender === "female"
        ? "Féminin"
        : "Autre";
  const tags = characterData.data.tags.join(", ");
  const ranges = characterData.data.range.map((e) => capitalizeFirstLetter(e));
  const range = ranges.length > 1 ? ranges.join(", ") : ranges[0];
  const position = characterData.data.position
    .map((e) => capitalizeFirstLetter(e))
    .join(", ");

  return { id: characterData._id, sprite, gender, tags, ressource, range, position };
}

function formatCharacter(id: string) {
  const characterData = allCharacters.value.find(({ _id }) => _id === id) as
    | ILolCharacter
    | undefined;
  if (!characterData) return undefined;

  switch (roomData.value.config?.theme) {
    case "league_of_legends":
      return formatLolCharacter(characterData);

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

socket.value?.on("game:speedrundle:data", ({ data }: { data: any }) => { 
  stateData.value.gameData = data;

  userAnswers.value = gameData.value.usersAnswers?.find(
    ({ playerId }) => playerId === currentUser.value._id
  );

  if (allCharacters.value && allCharacters.value.length === 0)
    allCharacters.value = data.allCharacters ?? [];
});

watch(
  () => characterGuessId.value,
  (newVal) => {
    if (newVal) handleSendCharacter();
  }
);
</script>
