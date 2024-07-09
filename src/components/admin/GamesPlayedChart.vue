<template>
  <div
    class="relative flex flex-col rounded-xl border border-dark3 shadow-2xl bg-dark2 bg-opacity-20"
  >
    <div
      class="relative mx-4 mt-4 flex flex-col gap-4 overflow-hidden rounded-none bg-transparent bg-clip-border text-gray-700 shadow-none md:flex-row md:items-center"
    >
      <div class="w-max rounded-lg bg-primary p-5 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
          class="h-6 w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
          ></path>
        </svg>
      </div>
      <div>
        <h6
          class="block font-sans text-base font-semibold leading-relaxed tracking-normal text-white antialiased"
        >
          Répartition des jeux joués
        </h6>
        <p
          class="block max-w-sm font-sans text-sm font-normal leading-normal text-gray-300 antialiased"
        >
          Nombres de parties pour chaque jeux sur l'année en cours
        </p>
      </div>
    </div>
    <div class="pt-6 px-2 pb-0">
      <div ref="chartRef"></div>
    </div>
  </div>
</template>
   
<script lang="ts" setup>
import { useAdminStore } from "@/modules/admin/admin.store";
import ApexCharts from "apexcharts";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const adminStore = useAdminStore();

const chartRef = ref();
const dashboardStats = computed(() => adminStore.getDashboardStats);

const speedrundleStats = computed(() => dashboardStats.value.gamesPlayedByMonth?.speedrundle || []);
const undercoverStats = computed(() => dashboardStats.value.gamesPlayedByMonth?.undercover || []);
const werewolvesStats = computed(() => dashboardStats.value.gamesPlayedByMonth?.werewolves || []);

const chartConfig = {
  series: [],
  chart: {
    type: "line",
    height: 500,
    toolbar: {
      show: false,
    },
  },
  title: {
    show: "",
  },
  dataLabels: {
    enabled: false,
  },
  colors: ["#B1AFFF", "#D37676", "#A5DD9B"],
  stroke: {
    lineCap: "round",
    curve: "smooth",
  },
  markers: {
    size: 0,
  },
  xaxis: {
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    labels: {
      style: {
        colors: "#616161",
        fontSize: "12px",
        fontFamily: "inherit",
        fontWeight: 400,
      },
    },
    categories: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
  },
  yaxis: {
    labels: {
      style: {
        colors: "#616161",
        fontSize: "12px",
        fontFamily: "inherit",
        fontWeight: 400,
      },
    },
  },
  grid: {
    show: false,
    padding: {
      top: 5,
      right: 20,
    },
  },
  fill: {
    opacity: 0.8,
  },
  tooltip: {
    theme: "dark",
  },
};

const chart = computed(() => new ApexCharts(chartRef.value, chartConfig));

const chartSeries = computed(() => [
  {
    name: "Undercover",
    data: undercoverStats.value,
  },
  {
    name: "Speedrundle",
    data: speedrundleStats.value,
  },
  {
    name: "Werewolves",
    data: werewolvesStats.value,
  },
]);

onMounted(() => {
  chart.value.render();
});

onBeforeUnmount(() => {
  chart.value.destroy();
});

watch(
  () => chartSeries.value,
  () => {
    chart.value.updateSeries(chartSeries.value);
  },
  { deep: true }
);
</script>