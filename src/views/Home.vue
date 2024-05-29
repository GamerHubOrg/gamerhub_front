<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <GameListItem name="Codenames" nbPlayers="4-8" time="<15min" img="/src/assets/games/codenames.png"/>
    <GameListItem name="Undercover" nbPlayers="3-12" time="10-30min" img="/src/assets/games/undercover.webp" />
  </div>
  
</template>

<script lang="ts" setup>
import GameListItem from "@/components/GameListItem.vue";
</script>