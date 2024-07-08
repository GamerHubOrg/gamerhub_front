<template>
  <div class="flex flex-col gap-3 text-white">
    <div class="option-container">
      <label for="mode">Mode de jeu :</label>
      <select
        id="mode"
        :disabled="isConfigDisabled"
        v-model="internalConfig.mode"
      >
        <option value="classic" class="text-black">Classic</option>
        <option value="less_trials" class="text-black">
          Few trials possible
        </option>
      </select>
    </div>

    <div class="option-container">
      <label for="theme">Thème :</label>
      <select
        id="theme"
        :disabled="isConfigDisabled"
        v-model="internalConfig.theme"
      >
        <option class="text-black" value="league_of_legends">
          League Of Legends
        </option>
        <option class="text-black" value="pokemon">Pokemon</option>
      </select>
    </div>

    <div
      v-if="internalConfig.theme === 'pokemon'"
      class="option-container !flex-col !items-start"
    >
      <label>Générations de Pokémon :</label>
      <div class="flex flex-wrap gap-2">
        <div v-for="generation in 9" :key="generation">
          <label>
            <input
              type="checkbox"
              :disabled="isConfigDisabled"
              :checked="
                internalConfig.selectedGenerations?.includes(generation)
              "
              @change="toggleGeneration(generation)"
              :value="generation"
            />
            {{ generation }}
          </label>
        </div>
      </div>
    </div>

    <div class="option-container !flex-col !items-start">
      <label>Indices :</label>
      <div class="flex flex-wrap gap-2">
        <div v-for="{ key, name } in columns" :key="key">
          <label>
            <input
              type="checkbox"
              :disabled="isConfigDisabled"
              :checked="internalConfig.selectedColumns?.includes(key)"
              @change="toggleColumn(key)"
              :value="key"
            />
            {{ name }}
          </label>
        </div>
      </div>
    </div>

    <div class="option-container">
      <label for="maxPlayers">Nombre de joueurs maximum :</label>
      <input
        id="maxPlayers"
        type="number"
        :disabled="isConfigDisabled"
        :min="1"
        placeholder="Entrez le nombre maximum de joueurs"
        v-model="internalConfig.maxPlayers"
      />
    </div>

    <div class="option-container">
      <label for="nbRounds">Nombre de rounds :</label>
      <input
        id="nbRounds"
        type="number"
        :disabled="isConfigDisabled"
        :min="1"
        :max="10"
        placeholder="Entrez le nombre de rounds"
        v-model="internalConfig.nbRounds"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/auth.store";
import { useSocketStore } from "@/modules/socket/socket.store";
import { computed, onMounted, ref, watch } from "vue";
import { ISpeedrundleConfig, speedrundleColumns } from "./speedrundle.types";
import { areObjectsEquals } from "@/utils/functions";

const emit = defineEmits(["update", "change"]);
const props = defineProps({
  config: {
    type: Object,
    default: () => {},
  },
});

const store = useAuthStore();
const socketStore = useSocketStore();

const internalConfig = ref<ISpeedrundleConfig>({
  maxPlayers: 6,
  nbRounds: 1,
  mode: "classic",
  theme: "league_of_legends",
  selectedGenerations: [],
  selectedColumns: [],
});

const columns = computed(() => {
  const cols = speedrundleColumns[internalConfig.value.theme].filter(
    ({ isIcon }) => !isIcon
  );
  return cols;
});

const timer = ref();
const data = computed(() => socketStore.getRoomData);

const currentUser = computed(() => store.getCurrentUser);
const isOwner = computed(() =>
  data.value.users?.some(
    ({ email, isOwner }) => email === currentUser.value?.email && !!isOwner
  )
);
const isConfigDisabled = computed(
  () => !isOwner.value || data.value.gameState !== "lobby"
);

const toggleGeneration = (generation: number) => {
  if (!internalConfig.value.selectedGenerations) return;
  if (internalConfig.value.selectedGenerations.includes(generation)) {
    internalConfig.value.selectedGenerations =
      internalConfig.value.selectedGenerations.filter((e) => e !== generation);
  } else internalConfig.value.selectedGenerations.push(generation);
};

const toggleColumn = (column: string) => {
  if (!internalConfig.value.selectedColumns) return;
  if (internalConfig.value.selectedColumns.includes(column)) {
    internalConfig.value.selectedColumns =
      internalConfig.value.selectedColumns.filter((e) => e !== column);
  } else internalConfig.value.selectedColumns.push(column);
};

watch(
  () => internalConfig.value,
  () => {
    if (!isOwner.value) return;
    if (timer.value) clearTimeout(timer.value);
    emit("change");
    timer.value = setTimeout(() => emit("update", internalConfig.value), 500);
  },
  { deep: true }
);

watch(
  () => ({ ...props.config }),
  () => {
    if (areObjectsEquals(internalConfig.value, props.config)) return;
    internalConfig.value = props.config as ISpeedrundleConfig;
  },
  { deep: true }
);

onMounted(() => {
  if (props.config && JSON.stringify(props.config) !== "{}") {
    internalConfig.value = props.config as ISpeedrundleConfig;
  }
  if (isOwner.value) {
    emit("update", internalConfig.value);
  }
});
</script>

<style lang="scss" scoped>
.option-container {
  @apply border border-dark3 rounded p-2 flex flex-row items-center gap-2;

  > label {
    @apply whitespace-nowrap font-semibold;
  }

  input[type="text"],
  input[type="number"],
  select {
    @apply bg-transparent w-full;
  }
}
</style>
