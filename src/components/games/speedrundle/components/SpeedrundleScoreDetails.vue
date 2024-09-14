<template>
  <div>
    <h3 class="text-xl text-center mb-2">{{ $t("games.speedrundle.game.details") }}</h3>
    <div class="flex gap-5 justify-center flex-wrap mb-2">
      <div v-for="character in finishedCharactersData" :key="character.id" class="flex flex-col items-center">
        <img v-if="!!character.image" :src="character.image" />
        <p v-if="character.abandon">{{ $t("games.speedrundle.game.abandoned") }}</p>
        <p v-else>{{ character.attempts }} {{ $t("shared.tries", character.attempts) }}</p>
      </div>
    </div>
    <p class="text-center" v-if="isWaiting">{{ $t("games.speedrundle.game.waitingPlayers") }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useSocketStore } from '@/modules/socket/socket.store';
import { computed } from 'vue';
import { ISpeedrundleAnswer, ISpeedrundleGameData, ISpeedrundleRoomData } from '../speedrundle.types';
import { formatCharacter } from '../speedrundle.functions';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: "global" })
const props = defineProps<{ userAnswers: ISpeedrundleAnswer, isWaiting?: boolean }>()
const socketStore = useSocketStore();

const stateData = computed(() => socketStore.getRoomData);
const roomData = computed(() => stateData.value as ISpeedrundleRoomData);
const gameData = computed(() => roomData.value.gameData as ISpeedrundleGameData);
const allCharacters = computed(() => gameData.value.allCharacters);
const charactersToGuess = computed(() => gameData.value.charactersToGuess);

const finishedCharactersData = computed(() => {
  const { roundsData } = props.userAnswers;
  return charactersToGuess.value.map((character, index) => ({
    id: character._id,
    image: formatCharacter(allCharacters.value, roomData.value.config?.theme!, character._id, t)?.sprite,
    attempts: roundsData?.[index].guesses.length || 0,
    score: roundsData?.[index].score || 0,
    abandon: !roundsData?.[index].hasFound,
  })) || [];
});
</script>