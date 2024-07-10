<template>
  <div class="mt-10 flex flex-col gap-5">
    <div class="grid grid-cols-3 gap-5">
      <article class="flex flex-col gap-4 rounded-xl border border-dark3 shadow-2xl bg-dark2 bg-opacity-20 p-6">
        <span class="inline-flex gap-2 self-end rounded bg-primary bg-opacity-20 p-1 px-2 text-green-600 text-sm font-medium">
          Live
        </span>

        <div>
          <strong class="block text-sm font-medium text-gray-100">Parties en cours</strong>

          <p>
            <span class="text-2xl font-bold text-white">{{ liveGames.length }}</span>
          </p>
        </div>
      </article>

      <article class="flex flex-col gap-4 rounded-xl border border-dark3 shadow-2xl bg-dark2 bg-opacity-20 p-6">
        <span class="inline-flex gap-2 self-end rounded bg-primary bg-opacity-20 p-1 px-2 text-green-600 text-sm font-medium">
          Mois courant
        </span>

        <div>
          <strong class="block text-sm font-medium text-gray-100">Utilisateurs</strong>

          <div class="flex flex-row gap-2 items-center">
            <span class="text-2xl font-bold text-white">{{ dashboardStats.usersThisMonth }}</span>
            <span class="text-primary mr-2 text-sm">+{{ Math.round(dashboardStats.usersThisMonth / dashboardStats.usersLastMonth * 100) }}%</span>
          </div>
        </div>
      </article>

      <article class="flex flex-col gap-4 rounded-xl border border-dark3 shadow-2xl bg-dark2 bg-opacity-20 p-6">
        <span class="inline-flex gap-2 self-end rounded bg-primary bg-opacity-20 p-1 px-2 text-green-600 text-sm font-medium">
          Depuis toujours
        </span>

        <div>
          <strong class="block text-sm font-medium text-gray-100">Utilisateurs</strong>

          <p>
            <span class="text-2xl font-bold text-white">{{ dashboardStats.usersSinceCreation }}</span>
          </p>
        </div>
      </article>
    </div>

    <GamesPlayedChart />
  </div>
</template>

<script lang="ts" setup>
import GamesPlayedChart from '@/components/admin/GamesPlayedChart.vue';
import { useAdminStore } from '@/modules/admin/admin.store';
import { useSocketStore } from '@/modules/socket/socket.store';
import { computed, onMounted } from 'vue';

const adminStore = useAdminStore();
const socketStore = useSocketStore();

const liveGames = computed(() => socketStore.getLiveGames);
const dashboardStats = computed(() => adminStore.getDashboardStats);

onMounted(async () => {
  await adminStore.fetchDashboardStats();
})
</script>