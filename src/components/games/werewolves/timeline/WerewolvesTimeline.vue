<template>
  <div class="flex flex-col gap-6">
    <WerewolvesTimelineTurn 
      v-for="turn in turns" 
      :key="turn" 
      :game-data="gameData" 
      :turn="turn" 
      :closed="turn > 1"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { IWerewolvesGameData } from '../werewolves.types';
import WerewolvesTimelineTurn from '@/components/games/werewolves/timeline/WerewolvesTimelineTurn.vue';

const props = defineProps<{
  gameData: IWerewolvesGameData,
}>()

const villageVotes = computed(() => props.gameData?.villageVotes || []);
const wolfVotes = computed(() => props.gameData?.wolfVotes || []);
const turns = computed(() => [...villageVotes.value, ...wolfVotes.value].reduce((acc, vote) => acc > vote.turn ? acc : vote.turn, 0));
</script>