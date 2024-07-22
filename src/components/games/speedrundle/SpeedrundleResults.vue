<template>
  <div class="text-white">
    <h1 class="text-center font-bold text-4xl mb-3">{{ $t("shared.results") }}</h1>

    <SpeedrundleResultsTable :users-answers="gameData.usersAnswers" :users="roomData.users"
      :characters-to-guess="charactersToGuess" />

    <SpeedrundleScoreDetails v-if="!!userAnswers" :user-answers="userAnswers" />
  </div>
</template>

<script setup lang="ts">
import { User as UserInterface } from "@/modules/auth/user";
import { computed } from "vue";
import { useSocketStore } from "@/modules/socket/socket.store";
import { useAuthStore } from "@/modules/auth/auth.store";
import {
  ISpeedrundleGameData,
  ISpeedrundleRoomData,
} from "./speedrundle.types";
import SpeedrundleResultsTable from "./components/SpeedrundleResultsTable.vue";
import SpeedrundleScoreDetails from "./components/SpeedrundleScoreDetails.vue";

const store = useAuthStore();
const socketStore = useSocketStore();

const currentUser = computed(() => store.getCurrentUser as UserInterface);
const roomData = computed(
  () => socketStore.getRoomData as ISpeedrundleRoomData
);
const gameData = computed(
  () => roomData.value.gameData as ISpeedrundleGameData
);

const charactersToGuess = computed(
  () => gameData.value.charactersToGuess ?? []
);
const userAnswers = computed(() => gameData.value.usersAnswers.find(
  ({ playerId }) => playerId === currentUser.value._id
))

</script>
