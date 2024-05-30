<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <GameListItem 
      name="Undercover" 
      nb-players="3-12"
      game-name="undercover"
      time="10-30min" 
      img="/src/assets/games/undercover.webp" 
    />
  </div>
  
</template>

<script lang="ts" setup>
import GameListItem from "@/components/GameListItem.vue";
</script>