<template>
  <div class="flex flex-col gap-2 border-4 border-dark2 rounded-lg overflow-hidden">
    <div class="p-3 bg-dark2 cursor-pointer flex flex-row items-center justify-between gap-1" @click="handleCollapseTurn">
      <span>{{ turn }}{{ turn === 1 ? 'er' : 'e' }} tour</span>
      <div class="flex flex-row items-center gap-2">
        <span 
          class="text-white rounded px-2 py-1 bg-green-400 text-sm"
          :class="{'bg-yellow-600': currentRoundTotalDeath === 1, 'bg-red-400': currentRoundTotalDeath > 1}"
        >
          {{ currentRoundTotalDeath }} morts
        </span>
      </div>
      <ChevronDownIcon v-if="!collapsed" class="w-5 text-white" />
      <ChevronRightIcon v-else class="w-5 text-white" />
    </div>
    <div v-if="!collapsed" class="flex flex-col gap-4">
      <div class="flex flex-col gap-3 p-3">
        <span class="w-full bg-dark2 p-3 rounded-md">Nuit</span>
        <!-- Thief row -->
        <div v-if="hasThiefPlayed" class="flex flex-row items-center gap-1">
          <WerewolvesPlayerName :user="thiefUser" :role="getPlayerSwapedRole(thiefUser?._id)" />
          <span>a volé le role de</span>
          <WerewolvesPlayerName :user="swapedUser" :role="getPlayerSwapedRole(swapedUser?._id)" />
          <span>qui devient donc</span>
          <WerewolvesPlayerName :user="swapedUser" :role="getPlayerRole(swapedUser?._id)" />
        </div>

        <!-- Cupidon row -->
        <div v-if="hasCupidonPlayed" class="flex flex-row items-center gap-1 flex-wrap">
          <WerewolvesPlayerName :user="cupidonUser" :role="getPlayerRole(cupidonUser?._id)" /> 
          <span>a uni</span>
          <WerewolvesPlayerName v-if="gameData?.couple" :user="getPlayer(gameData?.couple[0])" :role="getPlayerRole(gameData?.couple[0])" /> 
          <span>et</span>
          <WerewolvesPlayerName v-if="gameData?.couple" :user="getPlayer(gameData?.couple[1])" :role="getPlayerRole(gameData?.couple[1])" /> 
          <span>jusqu'à ce que la mort les sépare</span>
        </div>

        <!-- Psychic row -->
        <div v-if="hasPsychicPlayed" class="flex flex-row items-center gap-1">
          <WerewolvesPlayerName :user="psychicUser" :role="getPlayerRole(psychicUser?._id)" /> 
          <span>a regardé le role de</span>
          <WerewolvesPlayerName :user="getPlayer(currentTurnPsychicWatch?.watch)" :role="getPlayerRole(currentTurnPsychicWatch?.watch)" />
        </div>

        <!-- Wolves row -->
        <div v-if="hasWolvesVoted && wolvesMostVotedPlayer" class="flex flex-row items-center gap-1">
          <span>Les loups ont décidés de tuer</span>
          <WerewolvesPlayerName :user="getPlayer(wolvesMostVotedPlayer.vote)" :role="getPlayerRole(wolvesMostVotedPlayer.vote)" /> 
        </div>

        <!-- Witch kill row -->
        <div v-if="hasWitchKilled" class="flex flex-row items-center gap-1">
          <WerewolvesPlayerName :user="witchUser" :role="getPlayerRole(witchUser?._id)" /> 
          <span>utilisé une potion pour tuer</span>
          <WerewolvesPlayerName :user="getPlayer(currentTurnWitchKill?.kill)" :role="getPlayerRole(currentTurnWitchKill?.kill)" />
        </div>

        <!-- Witch save row -->
        <div v-if="hasWitchSaved" class="flex flex-row items-center gap-1">
          <WerewolvesPlayerName :user="witchUser" :role="getPlayerRole(witchUser?._id)" /> 
          <span>utilisé une potion pour sauver</span>
          <WerewolvesPlayerName :user="getPlayer(currentTurnWitchSave?.save)" :role="getPlayerRole(currentTurnWitchSave?.save)" />
        </div>
      </div>

      <div class="flex flex-col gap-3 p-3">
        <span class="w-full bg-dark2 p-3 rounded-md">Jour</span>
        <!-- Couple dead night row -->
        <div v-if="isCoupleDeadByNight" class="flex flex-row items-center gap-1">
          <WerewolvesPlayerName :user="getPlayer(couplePlayerDead)" :role="getPlayerRole(couplePlayerDead)" /> 
          <span>est mort cette nuit. Dans un élan de chagrin, </span>
          <WerewolvesPlayerName :user="getPlayer(otherCouplePlayer)" :role="getPlayerRole(otherCouplePlayer)" />
          <span>se donne la mort</span>
        </div>

        <!-- Night Hunter row -->
        <div v-if="hasHunterKilled && villageMostVotedPlayer && villageMostVotedPlayer.vote !== hunterUser?._id" class="flex flex-row items-center gap-1">
          <span>Le chasseur est mort durant la nuit.</span>
          <WerewolvesPlayerName :user="hunterUser" :role="getPlayerRole(hunterUser?._id)" /> 
          <span>a tiré sur</span>
          <WerewolvesPlayerName :user="getPlayer(currentTurnHunterKill?.kill)" :role="getPlayerRole(currentTurnHunterKill?.kill)" />
        </div>

        <!-- Villages row -->
        <div v-if="hasVillageVoted && villageMostVotedPlayer" class="flex flex-row items-center gap-1">
          <span>Les villageois ont décidés de tuer</span>
          <WerewolvesPlayerName :user="getPlayer(villageMostVotedPlayer.vote)" :role="getPlayerRole(villageMostVotedPlayer.vote)" /> 
        </div>

        <!-- Day Hunter row -->
        <div v-if="hasHunterKilled && villageMostVotedPlayer && villageMostVotedPlayer.vote === hunterUser?._id" class="flex flex-row items-center gap-1">
          <WerewolvesPlayerName :user="hunterUser" :role="getPlayerRole(hunterUser?._id)" /> 
          <span>a tiré sur</span>
          <WerewolvesPlayerName :user="getPlayer(currentTurnHunterKill?.kill)" :role="getPlayerRole(currentTurnHunterKill?.kill)" />
        </div>

        {{ villageMostVotedPlayer }}
        <!-- Couple dead day row -->
        <div v-if="isCoupleDeadByDay" class="flex flex-row items-center gap-1">
          <WerewolvesPlayerName :user="getPlayer(couplePlayerDead)" :role="getPlayerRole(couplePlayerDead)" /> 
          <span>est mort par le village. Dans un élan de chagrin, </span>
          <WerewolvesPlayerName :user="getPlayer(otherCouplePlayer)" :role="getPlayerRole(otherCouplePlayer)" />
          <span>se donne la mort</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { EWerewolvesRoleName, IWerewolvesGameData, IWerewolvesVote } from "../werewolves.types";
import WerewolvesPlayerName from './WerewolvesPlayerName.vue';
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/vue/24/solid";


const props = defineProps<{
  gameData: IWerewolvesGameData,
  turn: number,
  closed?: boolean
}>()

const gameRoles = computed(() => props.gameData.roles);
const gameUsers = computed(() => props.gameData.usersThatPlayed);

const collapsed = ref(true);

const currentTurnPsychicWatch = computed(() => props.gameData.psychicWatch?.find((w) => w.turn === props.turn));
const hasPsychicPlayed = computed(() => !!currentTurnPsychicWatch.value);
const psychicUser = computed(() => {
  const userId = Object.keys(gameRoles.value).find((userId) => gameRoles.value[userId]?.name === EWerewolvesRoleName.psychic);
  return gameUsers.value.find((u) => u._id === userId);
});

const currentTurnWitchKill = computed(() => props.gameData.witchKills?.find((w) => w.turn === props.turn));
const currentTurnWitchSave = computed(() => props.gameData.witchSaves?.find((w) => w.turn === props.turn));
const hasWitchKilled = computed(() => !!currentTurnWitchKill.value);
const hasWitchSaved = computed(() => !!currentTurnWitchSave.value);
const witchUser = computed(() => {
  const userId = Object.keys(gameRoles.value).find((userId) => gameRoles.value[userId]?.name === EWerewolvesRoleName.witch);
  return gameUsers.value.find((u) => u._id === userId);
});

const currentTurnWolvesVotes = computed(() => props.gameData.wolfVotes?.filter((w) => w.turn === props.turn) || [])
const hasWolvesVoted = computed(() => currentTurnWolvesVotes.value.length > 0);
const wolvesMostVotedPlayer = currentTurnWolvesVotes.value.reduce((acc: any, vote: IWerewolvesVote) => {
  const voteNumber = currentTurnWolvesVotes.value.filter((v) => v.vote === vote.vote).length;
  if (!acc) return undefined
  if (acc.count > 0 && acc.count === voteNumber && acc.vote !== vote.vote) return undefined;
  return acc.count > voteNumber ? acc : { ...vote, count: voteNumber };
  }, { count: 0 })

const currentTurnHunterKill = computed(() => props.gameData.hunterKills?.find((w) => w.turn === props.turn))
const hasHunterKilled = computed(() => !!currentTurnHunterKill.value);
const hunterUser = computed(() => {
  const userId = Object.keys(gameRoles.value).find((userId) => gameRoles.value[userId]?.name === EWerewolvesRoleName.hunter);
  return gameUsers.value.find((u) => u._id === userId);
});

const currentTurnVillagerVotes = computed(() => props.gameData.villageVotes?.filter((w) => w.turn === props.turn) || []);
const hasVillageVoted = computed(() => currentTurnVillagerVotes.value.length > 0);
const villageMostVotedPlayer = currentTurnVillagerVotes.value.reduce((acc: any, vote: IWerewolvesVote) => {
  const voteNumber = currentTurnVillagerVotes.value.filter((v) => v.vote === vote.vote).length;
  if (!acc) return undefined
  if (acc.count > 0 && acc.count === voteNumber && acc.vote !== vote.vote) return undefined;
  return acc.count > voteNumber ? acc : { ...vote, count: voteNumber };
}, { count: 0 })

const hasCupidonPlayed = computed(() => (props.gameData.couple?.length || 0) > 0);
const cupidonUser = computed(() => {
  const userId = Object.keys(gameRoles.value).find((userId) => gameRoles.value[userId]?.name === EWerewolvesRoleName.cupidon);
  return gameUsers.value.find((u) => u._id === userId);
});

const hasThiefPlayed = computed(() => (props.gameData.thiefUsers?.length || 0) > 0);
const swapedRoles = computed(() => props.gameData.swapedRoles || {});
const thiefUser = computed(() => {
  const userId = Object.keys(swapedRoles.value).find((userId) => swapedRoles.value[userId]?.name === EWerewolvesRoleName.thief);
  return gameUsers.value.find((u) => u._id === userId);
});
const swapedUser = computed(() => {
  const userId = Object.keys(swapedRoles.value).find((userId) => swapedRoles.value[userId]?.name !== EWerewolvesRoleName.thief);
  return gameUsers.value.find((u) => u._id === userId);
});

const hasWitchKilledCouple = computed(() => props.gameData.couple?.includes(currentTurnWitchKill.value?.kill as string));
const hasHunterKilledCouple = computed(() => props.gameData.couple?.includes(currentTurnHunterKill.value?.kill as string));
const isCoupleDeadByNight = computed(() => hasWitchKilledCouple.value || props.gameData.couple?.includes(wolvesMostVotedPlayer.value?.vote))
const isCoupleDeadByDay = computed(() => hasHunterKilledCouple.value || props.gameData.couple?.includes(villageMostVotedPlayer.value?.vote));
const couplePlayerDead = computed(() => {
  if (hasWitchKilledCouple.value) return currentTurnWitchKill.value?.kill;
  if (hasHunterKilledCouple.value) return currentTurnHunterKill.value?.kill;
  if (isCoupleDeadByNight) return wolvesMostVotedPlayer.value?.vote;
  if (isCoupleDeadByDay) return villageMostVotedPlayer.value?.vote;
});
const otherCouplePlayer = computed(() => props.gameData.couple?.find((userId: string) => userId !== couplePlayerDead.value));
const isCoupleDead = computed(() => isCoupleDeadByDay.value || isCoupleDeadByNight.value);

const currentRoundTotalDeath = computed(() => {
  let count = 0;
  if (hasWitchKilled.value) count++;
  if (hasHunterKilled.value) count++;
  if (hasWolvesVoted.value && !!wolvesMostVotedPlayer.value) count++;
  if (hasVillageVoted.value && !!villageMostVotedPlayer.value) count++;
  if (isCoupleDead.value) count++;
  return count;
})

function handleCollapseTurn() {
  collapsed.value = !collapsed.value;
}

function getPlayer(userId?: string) {
  return gameUsers.value.find((u) => u._id === userId);
}

function getPlayerRole(userId: string = '') {
  return gameRoles.value[userId];
}

function getPlayerSwapedRole(userId: string = '') {
  return swapedRoles.value[userId];
}

onMounted(() => {
  collapsed.value = props.closed === true ? true : false
})
</script>