<template>
  <div
      class="flex xl:flex-col w-[300px] h-3 xl:absolute xl:right-0 xl:bottom-1/2 xl:translate-y-1/2 xl:h-[300px] xl:w-3 bg-red-500 rounded-tl rounded-tr max-xl:rounded-bl max-xl:rounded-br">
      <span v-for="n in nbRounds" class="relative flex-1 flex items-center"
        :class="{ 'border-black max-xl:border-r-2':n < nbRounds ,'xl:border-b-2': n < nbRounds, 'bg-green-500': currentRound > n || playerState==='finished','rounded-tl': n === 1, 'rounded-bl': n === 1, 'rounded-tr': n === nbRounds, 'rounded-br': n === nbRounds , 'xl:rounded-tl': n === 1, 'xl:rounded-bl': n === nbRounds }">

        <div v-if="allUsersCurrentRound[n - 1]" class="absolute w-6 h-6 right-full mb-10 xl:mr-2 max-xl:translate-x-3">
          <img v-if="allUsersCurrentRound[n - 1].length === 1" :key="allUsersCurrentRound[n - 1][0]"
            :src="allUsersCurrentRound[n - 1][0]" class="w-full h-full rounded-full border border-white">
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
const playerState = computed(() => props.userAnswers.state);
</script>