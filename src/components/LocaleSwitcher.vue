<template>
  <div class="flex gap-1 items-center text-sm">
    <GlobeEuropeAfricaIcon class="h-5 w-5 text-gray-400" />
    <select v-model="$i18n.locale" class="bg-transparent">
      <option
        class="bg-lightgrey"
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
      >
        {{ getLocaleLabel(locale) }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { GlobeEuropeAfricaIcon } from "@heroicons/vue/24/outline";

const getLocaleLabel = (key: string) => {
  switch (key) {
    case "fr":
      return "Français";
    case "en":
      return "English";
    default:
      return key;
  }
};
</script>

<style scoped lang="scss"></style>
