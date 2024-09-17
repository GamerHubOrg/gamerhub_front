<template>
  <div class="flex flex-col gap-2 border-4 border-dark2 rounded-lg overflow-hidden">
    <div class="p-3 bg-dark2 cursor-pointer flex flex-row items-center justify-between gap-1" @click="handleCollapseTurn">
      <span>{{ turn }}{{ turn === 1 ? 'er' : 'e' }} {{ $t('games.werewolves.game.timeline.turn') }}</span>
      <div class="flex flex-row items-center gap-2">
        <span 
          class="text-white rounded px-2 py-1 bg-green-400 text-sm"
          :class="{'bg-yellow-600': currentRoundTotalDeath === 1, 'bg-red-400': currentRoundTotalDeath > 1}"
        >
          {{ currentRoundTotalDeath }} {{ $t('games.werewolves.game.timeline.deaths') }}
        </span>
      </div>
      <ChevronDownIcon v-if="!collapsed" class="w-5 text-white" />
      <ChevronRightIcon v-else class="w-5 text-white" />
    </div>
    <div v-if="!collapsed" class="flex flex-col gap-4">
      <div class="flex flex-col gap-3 p-3">
        <span class="w-full bg-dark2 p-3 rounded-md"> {{ $t('games.werewolves.game.timeline.night') }}</span>
        <!-- Thief row -->
        <div v-if="hasThiefPlayed" class="flex flex-row items-center gap-1">
          <WerewolvesPlayerName :user="thiefUser" :role="getPlayerSwapedRole(thiefUser?._id)" />
          <span>{{ $t('games.werewolves.game.timeline.stealRole') }}</span>
          <WerewolvesPlayerName :user="swapedUser" :role="getPlayerSwapedRole(swapedUser?._id)" />
          <span>{{ $t('games.werewolves.game.timeline.whoBecome') }}</span>
          <WerewolvesPlayerName :user="swapedUser" :role="getPlayerRole(swapedUser?._id)" />
        </div>

        <!-- Cupidon row -->
        <div v-if="hasCupidonPlayed" class="flex flex-row items-center gap-1 flex-wrap">
          <WerewolvesPlayerName :user="cupidonUser" :role="getPlayerRole(cupidonUser?._id)" /> 
          <span>{{ $t('games.werewolves.game.timeline.united') }}</span>
          <WerewolvesPlayerName v-if="gameData?.couple" :user="getPlayer(gameData?.couple[0])" :role="getPlayerRole(gameData?.couple[0])" /> 
          <span>{{ $t('games.werewolves.game.timeline.and') }}</span>
          <WerewolvesPlayerName v-if="gameData?.couple" :user="getPlayer(gameData?.couple[1])" :role="getPlayerRole(gameData?.couple[1])" /> 
          <span>{{ $t('games.werewolves.game.timeline.untilDeath') }}</span>
        </div>

        <!-- Psychic row -->
        <div v-if="hasPsychicPlayed" class="flex flex-row items-center gap-1">
          <WerewolvesPlayerName :user="psychicUser" :role="getPlayerRole(psychicUser?._id)" /> 
          <span>{{ $t('games.werewolves.game.timeline.watchedRole') }}</span>
          <WerewolvesPlayerName :user="getPlayer(currentTurnPsychicWatch?.target)" :role="getPlayerRole(currentTurnPsychicWatch?.target)" />
        </div>

        <!-- Wolves row -->
        <div v-if="hasWolvesVoted && wolvesMostVotedPlayer" class="flex flex-row items-center gap-1">
          <span>{{ $t('games.werewolves.game.timeline.wolfKilled') }}</span>
          <WerewolvesPlayerName :user="getPlayer(wolvesMostVotedPlayer.target)" :role="getPlayerRole(wolvesMostVotedPlayer.target)" /> 
        </div>

        <!-- Witch kill row -->
        <div v-if="hasWitchKilled" class="flex flex-row items-center gap-1">
          <WerewolvesPlayerName :user="witchUser" :role="getPlayerRole(witchUser?._id)" /> 
          <span>{{ $t('games.werewolves.game.timeline.killPotionUsed') }}</span>
          <WerewolvesPlayerName :user="getPlayer(currentTurnWitchKill?.target)" :role="getPlayerRole(currentTurnWitchKill?.target)" />
        </div>

        <!-- Witch save row -->
        <div v-if="hasWitchSaved" class="flex flex-row items-center gap-1">
          <WerewolvesPlayerName :user="witchUser" :role="getPlayerRole(witchUser?._id)" /> 
          <span>{{ $t('games.werewolves.game.timeline.savePotionUsed') }}</span>
          <WerewolvesPlayerName :user="getPlayer(currentTurnWitchSave?.target)" :role="getPlayerRole(currentTurnWitchSave?.target)" />
        </div>
      </div>

      <div class="flex flex-col gap-3 p-3">
        <span class="w-full bg-dark2 p-3 rounded-md">{{ $t('games.werewolves.game.timeline.day') }}</span>
        <!-- Couple dead night row -->
        <div v-if="isCoupleDeadByNight" class="flex flex-row items-center gap-1">
          <WerewolvesPlayerName :user="getPlayer(couplePlayerDead)" :role="getPlayerRole(couplePlayerDead)" /> 
          <span>{{ $t('games.werewolves.game.timeline.coupleDeadWolf') }} </span>
          <WerewolvesPlayerName :user="getPlayer(otherCouplePlayer)" :role="getPlayerRole(otherCouplePlayer)" />
          <span>{{ $t('games.werewolves.game.timeline.suicide') }}</span>
        </div>

        <!-- Night Hunter row -->
        <div v-if="hasHunterKilled && villageMostVotedPlayer && villageMostVotedPlayer.target !== hunterUser?._id" class="flex flex-row items-center gap-1">
          <span>{{ $t('games.werewolves.game.timeline.hunterDeadNight') }}</span>
          <WerewolvesPlayerName :user="hunterUser" :role="getPlayerRole(hunterUser?._id)" /> 
          <span>{{ $t('games.werewolves.game.timeline.shootOn') }}</span>
          <WerewolvesPlayerName :user="getPlayer(currentTurnHunterKill?.target)" :role="getPlayerRole(currentTurnHunterKill?.target)" />
        </div>

        <!-- Villages row -->
        <div v-if="hasVillageVoted && villageMostVotedPlayer" class="flex flex-row items-center gap-1">
          <span>{{ $t('games.werewolves.game.timeline.villagersKilled') }}</span>
          <WerewolvesPlayerName :user="getPlayer(villageMostVotedPlayer.target)" :role="getPlayerRole(villageMostVotedPlayer.target)" /> 
        </div>

        <!-- Day Hunter row -->
        <div v-if="hasHunterKilled && villageMostVotedPlayer && villageMostVotedPlayer.target === hunterUser?._id" class="flex flex-row items-center gap-1">
          <WerewolvesPlayerName :user="hunterUser" :role="getPlayerRole(hunterUser?._id)" /> 
          <span>{{ $t('games.werewolves.game.timeline.shootOn') }}</span>
          <WerewolvesPlayerName :user="getPlayer(currentTurnHunterKill?.target)" :role="getPlayerRole(currentTurnHunterKill?.target)" />
        </div>

        <!-- Couple dead day row -->
        <div v-if="isCoupleDeadByDay" class="flex flex-row items-center gap-1">
          <WerewolvesPlayerName :user="getPlayer(couplePlayerDead)" :role="getPlayerRole(couplePlayerDead)" /> 
          <span>{{ $t('games.werewolves.game.timeline.coupleDeadVillage') }} </span>
          <WerewolvesPlayerName :user="getPlayer(otherCouplePlayer)" :role="getPlayerRole(otherCouplePlayer)" />
          <span>{{ $t('games.werewolves.game.timeline.suicide') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { EWerewolvesRoleName, IWerewolvesGameData, IWerewolvesTarget } from "../werewolves.types";
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
const wolvesMostVotedPlayer = computed(() => currentTurnWolvesVotes.value.reduce((acc: any, vote: IWerewolvesTarget) => {
    const voteNumber = currentTurnWolvesVotes.value.filter((v) => v.target === vote.target).length;
    if (!acc) return undefined
    if (acc.count > 0 && acc.count === voteNumber && acc.target !== vote.target) return undefined;
    return acc.count > voteNumber ? acc : { ...vote, count: voteNumber };
  }, { count: 0 })
);

const currentTurnHunterKill = computed(() => props.gameData.hunterKills?.find((w) => w.turn === props.turn))
const hasHunterKilled = computed(() => !!currentTurnHunterKill.value);
const hunterUser = computed(() => {
  const userId = Object.keys(gameRoles.value).find((userId) => gameRoles.value[userId]?.name === EWerewolvesRoleName.hunter);
  return gameUsers.value.find((u) => u._id === userId);
});

const currentTurnVillagerVotes = computed(() => props.gameData.villageVotes?.filter((w) => w.turn === props.turn) || []);
const hasVillageVoted = computed(() => currentTurnVillagerVotes.value.length > 0);
const villageMostVotedPlayer = computed(() => currentTurnVillagerVotes.value.reduce((acc: any, vote: IWerewolvesTarget) => {
    const voteNumber = currentTurnVillagerVotes.value.filter((v) => v.target === vote.target).length;
    if (!acc) return undefined
    if (acc.count > 0 && acc.count === voteNumber && acc.target !== vote.target) return undefined;
    return acc.count > voteNumber ? acc : { ...vote, count: voteNumber };
  }, { count: 0 })
);
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

const hasWitchKilledCouple = computed(() => props.gameData.couple?.includes(currentTurnWitchKill.value?.target as string));
const hasHunterKilledCouple = computed(() => props.gameData.couple?.includes(currentTurnHunterKill.value?.target as string));
const isCoupleDeadByNight = computed(() => hasWitchKilledCouple.value || props.gameData.couple?.includes(wolvesMostVotedPlayer.value?.target))
const isCoupleDeadByDay = computed(() => hasHunterKilledCouple.value || props.gameData.couple?.includes(villageMostVotedPlayer.value?.target));
const couplePlayerDead = computed(() => {
  if (hasWitchKilledCouple.value) return currentTurnWitchKill.value?.target;
  if (hasHunterKilledCouple.value) return currentTurnHunterKill.value?.target;
  if (isCoupleDeadByNight) return wolvesMostVotedPlayer.value?.target;
  if (isCoupleDeadByDay) return villageMostVotedPlayer.value?.target;
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