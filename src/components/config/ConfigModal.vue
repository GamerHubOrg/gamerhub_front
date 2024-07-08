<template>
  <Modal :open="open" @close="$emit('close')">
  <div v-for="{value, label} in configValues">
    <p><span>{{ label }} : </span>{{format(value)}}</p>
  </div>
  </Modal>
</template>

<script lang="ts" setup>
import Modal from '@/components/Modal.vue';
import { IRoomConfig } from '@/types/interfaces';
import { computed } from 'vue';
import { ISpeedrundleConfig } from '../games/speedrundle/speedrundle.types';
import { capitalizeFirstLetter } from '@/utils/functions';
import { IUndercoverConfig } from '../games/undercover/undercover.types';

defineEmits(['close'])

const props = defineProps<{open : boolean, config? : IRoomConfig & {gameName : string}}>()

const configValues = computed(() => {
  const values : Record<string, any> = []
  if(!props.config) return;
  const {gameName, ...config} = props.config;
  values.push({label : "Max players", value : config.maxPlayers})
  switch (gameName) {
    case "speedrundle": {
        const {mode, nbRounds, theme, selectedColumns, selectedGenerations} = config as ISpeedrundleConfig;
        values.push({label : "Mode", value : mode}, {label : "Number of rounds", value : nbRounds}, {label : "Theme", value : theme}, {label : "Generations", value : selectedGenerations.join(", ") || "Toutes"}, {label : "Columns", value : selectedColumns.join(", ")})
      }
      break;
    case "undercover": {
        const {mode, theme, spyCount, wordsPerTurn, anonymousMode} = config as IUndercoverConfig;
        values.push({label : "Mode", value : mode}, {label : "Theme", value : theme}, {label : "Number of undercovers", value : spyCount}, {label : "Words per turn", value : wordsPerTurn}, {label : "Anonymous mode", value : anonymousMode})
      }
      break;
    default:
      break;
  }
  return values;
})

const format = (value : any) => {
  if(typeof value === "boolean") return value ? "Yes" : "No";
  if(typeof value !== "string") return value.toString();
  switch (value) {
    default:
    //@ts-ignore
      return capitalizeFirstLetter(value.replaceAll("_", " "))
  }
}


</script>

<style scoped lang="scss">
</style>