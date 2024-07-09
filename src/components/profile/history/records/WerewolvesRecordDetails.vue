<template>
  <div class="p-2 flex flex-col gap-6 mt-4">
    <WerewolvesCampWin :game-data="(gameData as IWerewolvesGameData)" />
    <div class="bg-black rounded-lg">
      <WerewolvesTimeline :game-data="(gameData as IWerewolvesGameData)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import WerewolvesTimeline from "@/components/games/werewolves/timeline/WerewolvesTimeline.vue";
import {
  IWerewolvesGameData,
  IWerewolvesPlayer,
} from "@/components/games/werewolves/werewolves.types";
import WerewolvesCampWin from "@/components/games/werewolves/WerewolvesCampWin.vue";
import { IWerewolvesRecord } from "@/modules/auth/gameRecords";
import { computed } from "vue";

const props = defineProps<{ record: IWerewolvesRecord }>();
const gameData = computed<Partial<IWerewolvesGameData>>(() => {
  const {
    campWin,
    roles,
    usersThatPlayed,
    couple,
    villageVotes,
    wolfVotes,
    psychicWatch,
    witchKills,
    witchSaves,
    hunterKills,
    thiefUsers,
    swapedRoles,
    usersData,
  } = props.record;
  return {
    campWin,
    roles,
    usersThatPlayed: usersThatPlayed?.map((_id) => {
      const username = usersData.find((e) => e._id === _id)?.username;
      return { _id, username } as IWerewolvesPlayer;
    }),
    couple,
    villageVotes,
    wolfVotes,
    psychicWatch,
    witchKills,
    witchSaves,
    hunterKills,
    thiefUsers,
    swapedRoles,
  };
});
</script>
