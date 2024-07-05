<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <GameListItem 
      name="Undercover" 
      nb-players="3-12"
      game-name="undercover"
      time="10-30min" 
      :img="undercoverImage" 
    />
    <GameListItem 
      name="SpeedrunDLE" 
      nb-players="1+"
      game-name="speedrundle"
      time="10-30min" 
      :img="speedrundleImage" 
    />
    <GameListItem 
      name="Werewolves" 
      nb-players="4-15"
      game-name="werewolves"
      time="10-40min" 
      :img="werewolvesImage" 
      :disabled="isWerewolvesDisabled"
    />
  </div>
  
</template>

<script lang="ts" setup>
import GameListItem from "@/components/GameListItem.vue";

import speedrundleImage from '@/assets/games/speedrundle.webp';
import werewolvesImage from '@/assets/games/werewolves.webp';
import undercoverImage from '@/assets/games/undercover.webp';
import { computed } from "vue";

const isWerewolvesDisabled = computed(() => import.meta.env.PROD);
</script>