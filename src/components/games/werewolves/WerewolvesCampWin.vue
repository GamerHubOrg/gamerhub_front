<template>
  {{ campWin }}
  <div 
    class="rounded-lg p-4 flex flex-row items-center gap-4"
    :class="{
      'bg-red-400': campWin === 'wolves',
      'bg-primary': campWin === 'village',
      'bg-blue-950': campWin === 'solo',
      'bg-gray-500': campWin === 'draw'
    }"
  >
    <img v-if="currentUserRole.camp === campWin" src="@/assets/games/werewolves/images/victory.svg" class="w-10" />
    <img v-else src="@/assets/games/werewolves/images/loose.svg" class="w-10" />
    <div>
      <span v-if="campWin === 'wolves'" class="font-bold text-2xl">Victoire des loups</span>
      <span v-else-if="campWin === 'village'" class="font-bold text-2xl">Victoire du village</span>
      <span v-else-if="campWin === 'solo'" class="font-bold text-2xl">Victoire du {role_solo}</span>
      <span v-else class="font-bold text-2xl">Egalité</span>

      <p v-if="campWin === 'wolves'">Tous les villageois sont morts, les loups remporte la partie !</p>
      <p v-else-if="campWin === 'village'">Tous les loups sont morts, les villageois remporte la partie !</p>
      <p v-else-if="campWin === 'solo'">Après avoir trahis son camp et tuer tous les autres joueurs, il remporte la partie !</p>
      <p v-else>Tous les joueurs sont morts, la partie se solde par une égalité !</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { IWerewolvesGameData } from "./werewolves.types";
import { useAuthStore } from "@/modules/auth/auth.store";

const props = defineProps<{
  gameData: IWerewolvesGameData,
}>()

const store = useAuthStore();

const currentUser = computed(() => store.getCurrentUser);
const campWin = computed(() => props.gameData.campWin ?? 'draw');
const gameRoles = computed(() => props.gameData.roles);

const currentUserRole = computed(() => gameRoles.value[currentUser.value?._id as string]);
</script>