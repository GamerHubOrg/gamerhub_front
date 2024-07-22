<template>
  <Modal :open="open && !shareModalOpen" @close="$emit('close')">
    <div v-for="{ value, label } in configValues">
      <p v-if="![undefined, null].includes(value)">
        <span>{{ label }} : </span>{{ format(value) }}
      </p>
    </div>
    <div class="flex gap-2">
      <Button type="secondary" shape="squared" class="mt-2" @click="shareModalOpen = true">
        <svg width="18" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 11V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V11M13 5L9 1M9 1L5 5M9 1V14"
            stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ $t("shared.share") }}
      </Button>
      <Button type="primary" shape="squared" class="mt-2" @click="playWithConfig">
        {{ $t("config.playModal.playWith") }}
      </Button>
    </div>
  </Modal>
  <ShareConfigModal v-if="nestedConfig" :open="open && shareModalOpen" @close="shareModalOpen = false"
    :gameName="config?.gameName" :config="nestedConfig" />
</template>

<script lang="ts" setup>
import Modal from "@/components/Modal.vue";
import { IRoomConfig } from "@/types/interfaces";
import { computed, ref } from "vue";
import { ISpeedrundleConfig } from "../games/speedrundle/speedrundle.types";
import { capitalizeFirstLetter } from "@/utils/functions";
import { IUndercoverConfig } from "../games/undercover/undercover.types";
import Button from "../Button.vue";
import ShareConfigModal from "./ShareConfigModal.vue";
import { useSocketStore } from "@/modules/socket/socket.store";
import { useGamesStore } from "@/modules/games/games.store";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const speedrundleT = (val: string) => t("games.speedrundle.configs." + val);
const undercoverT = (val: string) => t("games.undercover.configs." + val);
const emit = defineEmits(["close"]);
const props = defineProps<{
  open: boolean;
  config?: IRoomConfig & { gameName: string };
}>();

const gameStore = useGamesStore();
const socketStore = useSocketStore();
const authStore = useAuthStore();

const shareModalOpen = ref<boolean>(false);
const currentUser = computed(() => authStore.getCurrentUser);
const nestedConfig = computed(() => {
  if (!props.config) return;
  const { gameName, ...config } = props.config;
  return config;
});
const configValues = computed(() => {
  const values: Record<string, any> = [];
  if (!props.config) return;
  const { gameName, ...config } = props.config;
  values.push({ label: t("shared.maxPlayers", 2), value: config.maxPlayers });
  switch (gameName) {
    case "speedrundle":
      {
        const { mode, nbRounds, theme, selectedColumns, selectedGenerations } =
          config as ISpeedrundleConfig;

        values.push(
          { label: speedrundleT("mode.label"), value: speedrundleT("mode.values." + mode) },
          { label: speedrundleT("nbRounds"), value: nbRounds },
          { label: speedrundleT("theme"), value: theme },
          { label: speedrundleT("clues"), value: selectedColumns.map((e) => t(`games.speedrundle.columns.${theme}.${e}`)) }
        );
        if (theme === "pokemon")
          values.push({
            label: "Generations",
            value:
              selectedGenerations.length === 0 ? "All" : selectedGenerations,
          });
      }
      break;
    case "undercover":
      {
        const { mode, theme, spyCount, wordsPerTurn, anonymousMode } =
          config as IUndercoverConfig;
        values.push(
          { label: undercoverT("mode.label"), value: undercoverT("mode.values." + mode) },
          { label: undercoverT("theme.label"), value: undercoverT("theme.values." + theme) },
          { label: undercoverT("nbSpies"), value: spyCount },
          { label: undercoverT("nbWords"), value: wordsPerTurn },
          { label: undercoverT("hiddenMode"), value: anonymousMode }
        );
      }
      break;
    default:
      break;
  }
  return values;
});

const format = (value: any): string => {
  if (typeof value === "boolean") return value ? t("shared.yes") : t("shared.no");
  if (Array.isArray(value)) return value.map(format).join(", ");
  if (typeof value !== "string") return value.toString();
  switch (value) {
    default:
      //@ts-ignore
      return capitalizeFirstLetter(value.replaceAll("_", " "));
  }
};

const playWithConfig = () => {
  if (!props.config || !nestedConfig.value) return;
  emit("close");
  gameStore.setIsLobbyCollapsed(false);
  if (!currentUser.value) return;
  if (socketStore.roomId) {
    const data = socketStore.getRoomData;
    const roomUsers = data.users;
    const isOwner = computed(() =>
      roomUsers?.some(
        ({ email, isOwner }) => email === currentUser.value?.email && !!isOwner
      )
    );
    if (!isOwner) return;
    socketStore.handleUpdateRoom(
      nestedConfig.value,
      props.config.gameName !== data.gameName
        ? props.config.gameName
        : undefined
    );
  } else {
    socketStore.handleCreateRoom(
      currentUser.value,
      props.config.gameName,
      nestedConfig.value
    );
  }
};
</script>

<style scoped lang="scss"></style>
