<template>
  <div class="flex flex-col gap-3">
    <div v-for="record in gameRecords" class="flex flex-col gap-2">
      <div class="flex rounded bg-lightgrey w-full h-[110px] overflow-hidden">
        <SpeedrundleRecord
          v-if="record.gameName === 'speedrundle'"
          :record="record as ISpeedrundleRecord"
        />
        <div
          @click="toggleExpanded(record._id)"
          class="cursor-pointer h-full w-8 min-w-[32px] bg-[#555] flex items-end justify-center"
        >
          <svg
            v-if="expandedRecord === record._id"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            fill="#999"
            viewBox="0 0 512 512"
          >
            <path
              d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
            />
          </svg>
          <svg
            v-else
            width="20"
            fill="#999"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
            />
          </svg>
        </div>
      </div>
      <div v-if="expandedRecord === record._id" class="rounded bg-lightgrey p-2">
        <SpeedrundleRecordDetails
          v-if="record.gameName === 'speedrundle'"
          :record="record as ISpeedrundleRecord"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/auth.store";
import { computed, onMounted, ref, watch } from "vue";
import SpeedrundleRecord from "./records/SpeedrundleRecord.vue";
import SpeedrundleRecordDetails from "./records/SpeedrundleRecordDetails.vue";
import { ISpeedrundleRecord } from "@/modules/auth/gameRecords";

const authStore = useAuthStore();
const gameRecords = computed(() => {
  if (!authStore.gameRecords) return [];
  return authStore.gameRecords.sort((a, b) => {
    const aDate = new Date(a.createdAt).getTime();
    const bDate = new Date(b.createdAt).getTime();
    return bDate - aDate;
  });
});
const currentUser = computed(() => authStore.getCurrentUser);
const hasBeenFetched = ref<boolean>();
const expandedRecord = ref<string>("");

const toggleExpanded = (recordId: string) => {
  if (expandedRecord.value === recordId) {
    expandedRecord.value = "";
    return;
  }

  expandedRecord.value = recordId;
};

watch(
  () => hasBeenFetched.value,
  (val) => {
    if (val || !currentUser.value) return;
    authStore.fetchGameRecords();
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
</script>
