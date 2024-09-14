<template>
  <GameSelector @change="handleChangeSelectedGames" :selectedOptions="selectedGames"  />

  <div id="profile-history" class="flex flex-col gap-3">
    <div @click="refresh" ref="loadMore" class="bg-lightgrey p-2 rounded">
      <div v-if="refreshLoading" class="w-fit mx-auto">
        <Loader />
      </div>
      <div v-else class="flex gap-2 justify-center items-center cursor-pointer duration-200 hover:brightness-90">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" fill="white" viewBox="0 0 512 512">
          <path
            d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
        </svg>
        <span>{{$t("profile.historyTab.refresh")}}</span>
      </div>
    </div>
    <div :id="'record-' + i" v-for="record, i in filteredRecords" :key="record._id" class="flex flex-col gap-2">
      <div class="flex rounded bg-lightgrey w-full h-[142px] min-[800px]:h-[110px] overflow-hidden">
        <SpeedrundleRecord v-if="record.gameName === 'speedrundle'" :id="'record-' + i"
          :record="(record as ISpeedrundleRecord)" />
        <UndercoverRecord v-else-if="record.gameName === 'undercover'" :record="(record as IUndercoverRecord)" />
        <WerewolvesRecord v-else-if="record.gameName === 'werewolves'" :record="(record as IWerewolvesRecord)" />
        <div @click="toggleExpanded(record._id)"
          class="cursor-pointer h-full w-8 min-w-[32px] bg-[#555] flex items-end justify-center">
          <svg v-if="expandedRecord === record._id" xmlns="http://www.w3.org/2000/svg" width="20" fill="#999"
            viewBox="0 0 512 512">
            <path
              d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
          </svg>
          <svg v-else width="20" fill="#999" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
          </svg>
        </div>
      </div>
      <div v-if="expandedRecord === record._id" class="rounded bg-lightgrey p-2">
        <div v-if="!!record.config" class="flex">
          <Button type="secondary" shape="squared"
            @click="expandedConfig = { gameName: record.gameName, ...record.config }">{{$t("profile.historyTab.viewConfig")}}</Button>
        </div>
        <SpeedrundleRecordDetails v-if="record.gameName === 'speedrundle'" :record="(record as ISpeedrundleRecord)" />
        <UndercoverRecordDetails v-else-if="record.gameName === 'undercover'" :record="(record as IUndercoverRecord)" />
        <WerewolvesRecordDetails v-else-if="record.gameName === 'werewolves'" :record="(record as IWerewolvesRecord)" />
      </div>
    </div>
    <div v-if="totalRecords && totalRecords > gameRecords.length" ref="loadMore" class="bg-lightgrey p-2 rounded">
      <div v-if="fetchMoreLoading" class="w-fit mx-auto">
        <Loader />
      </div>
      <div v-else class="flex gap-2 justify-center items-center cursor-pointer duration-200 hover:brightness-90">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" fill="white" viewBox="0 0 512 512">
          <path
            d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
        </svg>
        <span>{{$t("profile.historyTab.loadMore")}}</span>
      </div>
    </div>
  </div>
  <ConfigModal :open="!!expandedConfig" @close="expandedConfig = undefined" :config="expandedConfig" shareable playable/>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/auth.store";
import { computed, onMounted, ref, watch } from "vue";
import SpeedrundleRecord from "./records/SpeedrundleRecord.vue";
import SpeedrundleRecordDetails from "./records/SpeedrundleRecordDetails.vue";
import { IGameRecord, ISpeedrundleRecord, IUndercoverRecord, IWerewolvesRecord } from "@/modules/auth/gameRecords";
import { useIntersectionObserver } from '@vueuse/core';
//@ts-ignore
import Loader from "@/components/Loader.vue";
import UndercoverRecord from "./records/UndercoverRecord.vue";
import UndercoverRecordDetails from "./records/UndercoverRecordDetails.vue";
import Button from "@/components/Button.vue";
import ConfigModal from '@/components/config/ConfigModal.vue';
import { IRoomConfig } from '@/types/interfaces';
import GameSelector from "@/components/filters/games/GameSelector.vue";
import { IOption } from "@/components/filters/games/game-filters.types";
import WerewolvesRecord from "./records/WerewolvesRecord.vue";
import WerewolvesRecordDetails from "./records/WerewolvesRecordDetails.vue";

const authStore = useAuthStore();
const gameRecords = computed<IGameRecord[]>(() => authStore.gameRecords || []);
const totalRecords = computed(() => authStore.totalRecords);
const currentUser = computed(() => authStore.getCurrentUser);
const hasBeenFetched = ref<boolean>();
const expandedRecord = ref<string>("");
const fetchMoreLoading = ref<boolean>(false)
const refreshLoading = ref<boolean>(false)
const expandedConfig = ref<IRoomConfig & { gameName: string } | undefined>()
const firstScroll = ref<boolean>(false);
const selectedGames = ref<IOption[]>([])
const gamePerLoad = 20;
const filteredRecords = computed<IGameRecord[]>(() => {
  if(selectedGames.value.length === 0) return gameRecords.value;
  return gameRecords.value.filter(({gameName}) => selectedGames.value.some((e) => e.value === gameName));
})

const handleChangeSelectedGames = (games: IOption[]) => selectedGames.value = games;

const toggleExpanded = (recordId: string) => {
  if (expandedRecord.value === recordId) {
    expandedRecord.value = "";
    return;
  }

  expandedRecord.value = recordId;
};

const refresh = () => {
  refreshLoading.value = true
  authStore.refreshGameRecords().then(() => refreshLoading.value = false);
}

const fetchMore = () => {
  fetchMoreLoading.value = true
  authStore.fetchGameRecords(gameRecords.value.length, gamePerLoad).finally(() => fetchMoreLoading.value = false);
  if (gameRecords.value.length === 0) hasBeenFetched.value = true;
};

watch(
  () => hasBeenFetched.value,
  (val) => {
    if (val || !currentUser.value) return;
    fetchMoreLoading.value = true;
    authStore.fetchGameRecords(0, gamePerLoad).finally(() => fetchMoreLoading.value = false);
    hasBeenFetched.value = true;
  }
);

watch(
  () => currentUser.value,
  (val) => {
    if (!val) return;
    hasBeenFetched.value = false;
  }
);

onMounted(() => {
  if (!hasBeenFetched.value && currentUser.value) hasBeenFetched.value = false;
});

const loadMore = ref(null)

useIntersectionObserver(
  loadMore,
  ([{ isIntersecting }]) => {
    if (isIntersecting && hasBeenFetched.value === true && firstScroll.value === true) fetchMore()
    firstScroll.value = true;
  },
  { threshold: 1 }
)
</script>
