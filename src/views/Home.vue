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
  </div>
  
</template>

<script lang="ts" setup>
import GameListItem from "@/components/GameListItem.vue";

import speedrundleImage from '@/assets/games/speedrundle.webp';
import undercoverImage from '@/assets/games/undercover.webp';
</script>