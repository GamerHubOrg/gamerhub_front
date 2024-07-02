<template>
  <div class="flex flex-col absolute right-0 bottom-1/2 translate-y-1/2 h-[300px] w-3 bg-red-500 rounded-tl rounded-bl">
    <span v-for="n in nbRounds" class="relative flex-1 flex items-center" :class="{
      'border-black border-b-2': n < nbRounds,
      'bg-green-500': currentRound > n,
      'rounded-tl': n === 1,
      'rounded-bl': n === nbRounds,
    }">
      <div v-if="allUsersCurrentRound[n - 1]" class="absolute w-6 h-6 right-full mr-2">
        <img v-if="allUsersCurrentRound[n - 1].length === 1" :key="allUsersCurrentRound[n - 1][0]"
          :src="allUsersCurrentRound[n - 1][0]" class="w-full h-full rounded-full border border-white" />
        <span v-else
          class="flex items-center justify-center w-full h-full font-bold bg-white rounded-full text-black border border-white">
          {{ allUsersCurrentRound[n - 1].length }}</span>
      </div>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { useSocketStore } from '@/modules/socket/socket.store';
import { computed } from 'vue';
import { ISpeedrundleGameData, ISpeedrundleRoomData, ISpeedrundleAnswer } from '../speedrundle.types';

const props = defineProps<{ userAnswers: ISpeedrundleAnswer }>()

const socketStore = useSocketStore();

const stateData = computed(() => socketStore.getRoomData);
const roomData = computed(() => stateData.value as ISpeedrundleRoomData);
const gameData = computed(() => roomData.value.gameData as ISpeedrundleGameData);

const currentRound = computed(() => props.userAnswers.currentRound || 1);
const nbRounds = computed(() => roomData.value.config?.nbRounds || 0);
const allUsersCurrentRound = computed(() => {
  const rounds: string[][] = [];
  for (const { _id, picture } of roomData.value.users) {
    if (!picture) continue;
    const answers = gameData.value.usersAnswers?.find(({ playerId }) => _id === playerId);
    if (!answers || answers.state === "finished") continue;
    const roundIndex = answers.currentRound - 1;
    rounds[roundIndex] = [...(rounds[roundIndex] || []), picture];
  }

  return rounds;
});
</script>