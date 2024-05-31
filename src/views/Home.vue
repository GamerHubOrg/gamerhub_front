<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <GameListItem 
      name="Undercover" 
      nb-players="3-12"
      game-name="undercover"
      time="10-30min" 
      :img="undercoverImage" 
    />
  </div>
  
</template>

<script lang="ts" setup>
import GameListItem from "@/components/GameListItem.vue";

const undercoverImage = import('/src/assets/games/undercover.webp');
</script>