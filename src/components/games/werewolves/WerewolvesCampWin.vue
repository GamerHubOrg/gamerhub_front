<template>
  <div 
    class="rounded-lg p-4 flex flex-row items-center gap-4"
    :class="{
      'bg-red-400': campWin === 'wolves',
      'bg-primary': campWin === 'village',
      'bg-blue-950': campWin === 'solo',
      'bg-dark5': campWin === 'draw'
    }"
  >
    <img v-if="currentUserRole.camp === campWin" src="@/assets/games/werewolves/images/victory.svg" class="w-10" />
    <img v-else src="@/assets/games/werewolves/images/loose.svg" class="w-10" />
    <div>
      <span class="font-bold text-2xl">{{ gameCampWin }}</span>

      <p v-if="campWin === 'wolves'">{{ $t('games.werewolves.game.campWin.wolvesWin') }}</p>
      <p v-else-if="campWin === 'village'">{{ $t('games.werewolves.game.campWin.villageWin') }}</p>
      <p v-else-if="campWin === 'solo'">{{ $t('games.werewolves.game.campWin.soloWin') }}</p>
      <p v-else>{{ $t('games.werewolves.game.campWin.draw') }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { IWerewolvesGameData } from "./werewolves.types";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  gameData: IWerewolvesGameData,
}>()

const store = useAuthStore();
const { t } = useI18n(); 

const currentUser = computed(() => store.getCurrentUser);
const campWin = computed(() => props.gameData.campWin ?? 'draw');
const gameRoles = computed(() => props.gameData.roles);

const currentUserRole = computed(() => gameRoles.value[currentUser.value?._id as string]);
const aliveUsers = computed(() => props.gameData.usersThatPlayed.filter((user) => gameRoles.value[user._id]?.isAlive));

const gameCampWin = computed(() => {
  if (campWin.value === 'wolves') return t('games.werewolves.game.campWin.wolvesWinTitle');
  if (campWin.value === 'village') return t('games.werewolves.game.campWin.villageWinTitle');
  const hasCoupleWon = aliveUsers.value.length === props.gameData.couple?.length;
  if (campWin.value === 'solo' && hasCoupleWon) return t('games.werewolves.game.campWin.coupleWinTitle');
  if (campWin.value === 'solo') return t('games.werewolves.game.campWin.soloWinTitle');
  return t('games.werewolves.game.campWin.drawTitle');
})
</script>