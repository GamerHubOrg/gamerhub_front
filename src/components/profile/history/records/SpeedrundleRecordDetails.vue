<template>
  <div>
    <SpeedrundleResultsTable
      :users-answers="record.usersAnswers"
      :users="record.usersData"
      :characters-to-guess="record.charactersData"
    />
  </div>
</template>

<script lang="ts" setup>
import SpeedrundleResultsTable from "@/components/games/speedrundle/components/SpeedrundleResultsTable.vue";
import { ISpeedrundleRecord } from "@/modules/auth/gameRecords";
defineProps<{ record: ISpeedrundleRecord }>();
</script>
