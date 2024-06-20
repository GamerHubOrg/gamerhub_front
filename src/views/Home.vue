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
      :img="codenamesImage" 
    />
  </div>
  
</template>

<script lang="ts" setup>
import GameListItem from "@/components/GameListItem.vue";

import codenamesImage from '@/assets/games/codenames.png';
import undercoverImage from '@/assets/games/undercover.webp';
</script>