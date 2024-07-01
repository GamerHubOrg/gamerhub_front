<template>
  <h2 class="text-3xl">Speedrun DLE</h2>
  <p>
    Le thème de la partie est :
    <span class="font-semibold">{{ getThemeLabel() }} - {{ getModeLabel() }}</span>
  </p>
</template>

<script setup lang="ts">
import { ISpeedrundleConfig } from "../speedrundle.types";
import { computed } from "vue";
import { capitalizeFirstLetter } from "../../../utils/functions";

const props = defineProps<{
  config: ISpeedrundleConfig;
}>();

const config = computed(() => props.config);

const getThemeLabel = () => {
  switch (config.value.theme) {
    case "league_of_legends":
      return "League of Legends";
    case "pokemon":
      return "Pokémon";
    default:
      return capitalizeFirstLetter(config.value.theme);
  }
};

const getModeLabel = () => {
  switch (config.value.mode) {
    default:
      return capitalizeFirstLetter(config.value.mode);
  }
};
</script>
