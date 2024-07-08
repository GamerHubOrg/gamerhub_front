<template>
  <div class="flex flex-col items-center gap-7 mt-4 pb-10">
    <SpeedrundleHeader :config="roomConfig" />
    <SpeedrundleGameProgress v-if="!!userAnswers" :user-answers="userAnswers" />
    <SpeedrundleScoreDetails v-if="!!userAnswers && playerState === 'finished'" :user-answers="userAnswers" :is-waiting="true" />

    <div v-else class="flex flex-col items-center gap-7 max-w-[1500px] w-full mr-16 ml-16">
      <Select :value="characterGuessId" @update="handleCharacterSelect" :hide-options="true" :query-starts-with="true"
        :options="filteredCharacters" />
      <Button color="danger" @click="handleGiveUpCharacter">Abandonner ce personnage</Button>
      <div class="w-full max-xl:h-[370px] max-xl:overflow-y-auto overflow-x-auto">
        <table class=" bg-dark2 w-full border-spacing-0 border-collapse">
          <thead class="sticky bg-dark2 top-[-1px] gap-0 z-10 p-0">
            <tr class="p-0">
              <th v-for="column in gameData?.columns" :key="column.name" class="p-0">
                {{ column.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guess in reversedGuessedCharacters" :key="guess?.id">
              <th v-for="column in gameData?.columns" :class="getColumnClass(guess.id, column.key)" :key="column.key" class="p-2 border-black border">
                <img v-if="column.type === 'image'" :src="guess[column.key as keyof object]" class="mx-auto" />
                <p v-else>{{ guess[column.key as keyof object] }}</p>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <SpeedrundleUserScore />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/auth.store";
import { User } from "@/modules/auth/user";
import { useSocketStore } from "@/modules/socket/socket.store";
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
import {
  compareLolGuessToAnswer,
  comparePokemonGuessToAnswer,
  formatCharacter,
} from "./speedrundle.functions";
import Select from "@/components/Select.vue";
import findCharacterSound from "@/assets/games/speedrundle/sounds/find-character.wav";
import giveUpCharacterSound from "@/assets/games/speedrundle/sounds/give-up-character.wav";
import Button from "@/components/Button.vue";
import { ISpeedrundleConfig } from "./speedrundle.types";
import SpeedrundleHeader from "./components/SpeedrundleHeader.vue";
import SpeedrundleUserScore from "./components/SpeedrundleUserScore.vue";
import SpeedrundleGameProgress from "./components/SpeedrundleGameProgress.vue";
import SpeedrundleScoreDetails from "./components/SpeedrundleScoreDetails.vue";


const store = useAuthStore();
const socketStore = useSocketStore();

const stateData = computed(() => socketStore.getRoomData);
const roomId = computed(() => socketStore.getRoomId);
const socket = computed(() => socketStore.getSocket);
const currentUser = computed(() => store.getCurrentUser as User);
const roomData = computed(() => stateData.value as ISpeedrundleRoomData);
const roomConfig = computed(() => roomData.value.config as ISpeedrundleConfig);
const gameData = computed(() => roomData.value.gameData as ISpeedrundleGameData);

const characterGuessId = ref<string>("");
const userAnswers = ref<ISpeedrundleAnswer>();

const charactersToGuess = ref<ICharacter[]>([]);
const allCharacters = ref<ICharacter[]>([]);
const playerState = computed(() => userAnswers.value?.state);
const reversedGuessedCharacters = computed(() => [...guessedCharacters.value].reverse());
const currentRound = computed(() => userAnswers.value?.currentRound || 1);
const currentCharacterToGuess = computed(
  () => charactersToGuess.value[currentRound.value - 1]
);


const guessedCharacters = computed(() => {
  if (!userAnswers.value) return [];
  const { roundsData, currentRound } = userAnswers.value;
  return (
    roundsData[currentRound - 1].guesses
      .map((characterId) => formatCharacter(allCharacters.value, roomData.value.config?.theme!, characterId))
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



function compareGuessToAnswer(id: string, column: string): SpeedrundleAnswerClues {
  const characterData = allCharacters.value.find(({ _id }) => _id === id);
  if (!characterData || !currentCharacterToGuess.value) return "false";

  switch (roomData.value.config?.theme) {
    case "league_of_legends":
      return compareLolGuessToAnswer(
        currentCharacterToGuess.value as ILolCharacter,
        characterData as ILolCharacter,
        column
      );
    case "pokemon":
      return comparePokemonGuessToAnswer(
        currentCharacterToGuess.value as IPokemonCharacter,
        characterData as IPokemonCharacter,
        column
      );
    default:
      return "false";
  }
}

function getColumnClass(id: string, column: string) {
  const comparisonResult = compareGuessToAnswer(id, column);
  return {
    "bg-red-500": ["false", "more", "less"].includes(comparisonResult),
    "bg-orange-500": comparisonResult === "partial",
    "bg-green-500": comparisonResult === "true",
    "arrow-up": comparisonResult === "more",
    "arrow-down": comparisonResult === "less",
  };
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
  socket.value?.emit("game:speedrundle:give-up", roomId.value, currentUser.value._id);
}

function handlePlaySoundEffect(sound: string) {
  const wordAudio = new Audio(sound);
  wordAudio.volume = 0.05;
  wordAudio.play();
}

socket.value?.on("game:speedrundle:give-up-character", () =>
  handlePlaySoundEffect(giveUpCharacterSound)
);
socket.value?.on("game:speedrundle:find-character", () =>
  handlePlaySoundEffect(findCharacterSound)
);
socket.value?.on("game:speedrundle:end-game", () =>
  handlePlaySoundEffect(findCharacterSound)
);

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
  content: "";
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
  background-image: url("../../../assets/icons/arrow-up.svg");
}

.arrow-down::before {
  background-image: url("../../../assets/icons/arrow-down.svg");
}
</style>
