<template>
  <div class="mt-6 flex flex-col gap-6">

    <div>
      <div class="border-b border-dark1 bg-dark3 py-4 rounded-t-xl">
        <div
          class="mx-auto flex max-w-7xl items-center justify-between px-6"
        >
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton
                class="group inline-flex justify-center text-sm font-medium text-gray-200 hover:text-gray-400"
              >
                Sort
                <ChevronDownIcon
                  class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-white group-hover:text-gray-200"
                  aria-hidden="true"
                />
              </MenuButton>
            </div>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-dark2 shadow-2xl ring-1 ring-gray-400 ring-opacity-5 focus:outline-none"
              >
                <div class="py-1">
                  <MenuItem
                    v-for="option in sortOptions"
                    :key="option.name"
                  >
                    <span
                      @click="() => handleSetActiveSort(option)"
                      class="block px-4 py-2 text-sm cursor-pointer"
                      :class="[
                          activeSort?.label === option.label && activeSort.value === option.value
                              ? 'font-medium text-white'
                              : 'text-gray-400',
                          activeSort?.label === option.label && activeSort.value === option.value 
                              ? 'bg-dark5' 
                              : '',
                      ]"
                      >{{ option.name }}</span>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

          <div>
            <div class="flow-root">
              <PopoverGroup
                class="-mx-4 flex items-center divide-x divide-gray-200"
              >
                <Popover
                  v-for="(section) in filters"
                  :key="section.name"
                  class="relative inline-block px-4 text-left"
                >
                  <PopoverButton
                    class="group inline-flex justify-center text-sm font-medium text-gray-200 hover:text-gray-400"
                  >
                    <span>{{ section.name }}</span>
                    <span
                      v-if="activeFilters.length > 0"
                      class="ml-1.5 rounded bg-dark1 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-300"
                      >{{ activeFilters.length }}</span
                    >
                    <ChevronDownIcon
                      class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-white group-hover:text-gray-200"
                      aria-hidden="true"
                    />
                  </PopoverButton>

                  <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <PopoverPanel
                      class="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-dark2 p-4 shadow-2xl ring-1 ring-gray-400 ring-opacity-5 focus:outline-none"
                    >
                      <form class="space-y-4">
                        <div
                          v-for="(option, optionIdx) in section.options"
                          :key="option.value"
                          class="flex items-center"
                        >
                          <input
                            :id="`filter-${section.id}-${optionIdx}`"
                            :name="`${section.id}[]`"
                            :value="option.value"
                            type="checkbox"
                            class="h-4 w-4 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            @change="() => handleFilterChange(section, option)"
                          />
                          <label
                            :for="`filter-${section.id}-${optionIdx}`"
                            class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-400"
                            >{{ option.label }}</label
                          >
                        </div>
                      </form>
                    </PopoverPanel>
                  </transition>
                </Popover>
              </PopoverGroup>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-dark2">
        <div
          class="mx-auto max-w-7xl px-6 py-3 flex items-center"
        >
          <h3 class="text-sm font-medium text-white">Filters</h3>

          <div
            aria-hidden="true"
            class="h-5 w-px bg-gray-300 ml-4 block"
          />

          <div class="ml-4 mt-0">
            <div class="-m-1 flex flex-wrap items-center">
              <span v-if="activeFilters.length === 0" class="text-gray-400 text-xs">No filters</span>
              <span
                v-for="activeFilter in activeFilters"
                :key="activeFilter.value"
                class="m-1 inline-flex items-center rounded-full border border-dark5 bg-dark1 py-1.5 pl-3 pr-2 text-sm font-medium text-gray-300"
              >
                <span>{{ activeFilter.label }}</span>
                <button
                  type="button"
                  class="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-dark5 hover:text-gray-200"
                  @click="handleRemoveFilter(activeFilter)"
                >
                  <svg
                    class="h-2 w-2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 8 8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-width="1.5"
                      d="M1 1l6 6m0-6L1 7"
                    />
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 rounded-b-2xl bg-dark2">
        <table class="w-full whitespace-nowrap text-left">
          <colgroup>
            <col class="lg:w-1/12" />
            <col class="w-full lg:w-6/12" />
            <col class="lg:w-1/12" />
            <col class="lg:w-2/12" />
            <col class="lg:w-1/12" />
            <col class="lg:w-1/12" />
          </colgroup>
          <thead class="border-b border-white/10 text-xs leading-6 text-white">
            <tr>
              <th scope="col" class="py-2 font-semibold table-cell lg:pr-20">Upvotes</th>
              <th scope="col" class="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">Name</th>
              <th scope="col" class="py-2 pl-0 pr-8 font-semibold table-cell">Game</th>
              <th scope="col" class="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell">Published by</th>
              <th scope="col" class="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8">Created at</th>
              <th scope="col" class="py-2 font-semibold table-cell">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-white/5">
            <tr v-for="config in configs" :key="config._id">
              <td class="py-2 pl-0 pr-8 font-semibold table-cell lg:pr-20">
                <div class="flex">
                  <div class="rounded-md bg-gray-700/40 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-white/10">{{ config.upvotes }}</div>
                </div>
              </td>
              <td class="py-2 pl-4 font-semibold sm:pl-6 lg:pl-8">
                <div class="text-gray-300 text-xs">{{ config.name }}</div>
              </td>
              <td class="py-2 font-semibold table-cell">
                <div class="text-gray-300 text-xs">{{ config.game }}</div>
              </td>
              <td class="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell">
                <User :id="config.userId" v-slot="{ loading, user }">
                  <div v-if="loading || !user">
                    <Loader size="w-6 h-6" />
                  </div>
                  <div v-else class="flex items-center gap-x-4 text-xs">
                    <img :src="user.picture" alt="" class="h-6 w-6 rounded-full bg-gray-800" />
                    <div class="truncate font-medium leading-6 text-white">
                        <span>{{ user.username }}</span>
                    </div>
                  </div>
                </User>
              </td>
              <td class="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8">
                <div class="text-gray-300 text-xs">{{ config.createdAt }}</div>
              </td>
              <td class="py-2 font-semibold table-cell">
                <div class="flex text-xs">
                  <Button type="primary">Jouer</Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
    </div>
    </div>

    <nav class="flex items-center justify-between border-t border-primary px-4 sm:px-0">
      <div class="-mt-px flex w-0 flex-1">
        <span 
          class="cursor-pointer inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-300 hover:border-gray-300 hover:text-gray-400"
          :class="{'opacity-50 cursor-not-allowed': currentPage === 0}"
          @click="currentPage > 0 && handleChangePage(-1)"
        >
          <ArrowLongLeftIcon class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Previous
        </span>
      </div>
      <div class="hidden md:-mt-px md:flex">
        <span 
          v-for="(_, index) in pagination" :key="index"
          class="cursor-pointer inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-300 hover:border-gray-300 hover:text-gray-400"
          :class="{
            'border-white text-white': currentPage === index,
          }"
          @click="currentPage = index"
        >
          {{ index + 1 }}
        </span>
      </div>
      <div class="-mt-px flex w-0 flex-1 justify-end">
        <span 
          class="cursor-pointer inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-300 hover:border-gray-300 hover:text-gray-400"
          :class="{'opacity-50 cursor-not-allowed': currentPage >= pagination.length}"
          @click="currentPage < pagination.length && handleChangePage(1)"
        >
          Next
          <ArrowLongRightIcon class="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {
  Menu,
  MenuItems,
  MenuButton,
  MenuItem,
  PopoverGroup,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/vue";
import Button from "@/components/Button.vue";
import { ChevronDownIcon, ArrowLongLeftIcon, ArrowLongRightIcon } from "@heroicons/vue/20/solid";
import { computed, onMounted, ref, watch } from "vue";
import { useGamesStore } from "@/modules/games/games.store";
import User from '@/components/User.vue';
import Loader from '@/components/Loader.vue';
import { Config } from "@/modules/games/games.types";

interface IConfigSort {
    name: string;
    label: string;
    value: any;
}

interface IConfigFilterOption {
    value: string;
    label: string;
}

interface IConfigFilter {
    id: string;
    name: string;
    options: IConfigFilterOption[];
}

interface IActiveFilter {
    label: string;
    key: string;
    value: string;
}

const gamesStore = useGamesStore();

const filtersTimer = ref();
const activeFilters = ref<IActiveFilter[]>([]);
const activeSort = ref();
const pageSize = ref(20);
const currentPage = ref(0);

const configs = computed<Config[]>(() => gamesStore.getConfigs.list || []);
const totalConfig = computed<number>(() => gamesStore.getConfigs.total || 0);

const sortOptions: IConfigSort[] = [
    { name: "Upvotes: High to Low", label: "upvotes", value: -1 },
    { name: "Upvotes: Low to High", label: "upvotes", value: 1 },
    { name: "Oldest", label: "createdAt", value: -1 },
    { name: "Newest", label: "createdAt", value: 1 },
];

const filters: IConfigFilter[] = [
  {
    id: "game",
    name: "Games",
    options: [
      { value: "undercover", label: "Undercover" },
      { value: "speedrundle", label: "Speedrundle" },
    ],
  },
];

const pagination = computed(() => Array(Math.ceil(totalConfig.value / pageSize.value)))

function handleChangePage(direction: number) {
  currentPage.value += direction;
}

function handleSetActiveSort(sort: IConfigSort) {
    activeSort.value = { [sort.label]: sort.value };
}

function handleRemoveFilter(activeFilter: IActiveFilter) {
    activeFilters.value = [
        ...activeFilters.value.filter((f) => f.key !== activeFilter.key || f.value !== activeFilter.value),
    ]
}

function handleFilterChange(filter: IConfigFilter, option: IConfigFilterOption) {
    const alreadyExist = !!activeFilters.value.find((f) => f.key === filter.id && f.value === option.value);
    if (!alreadyExist) {
        activeFilters.value.push({ 
            label: option.label, 
            value: option.value, 
            key: filter.id 
        })
        return;
    }

    activeFilters.value = [
        ...activeFilters.value.filter((f) => f.key !== filter.id || f.value !== option.value),
    ]
}

async function handleFetchConfigs() {
    try {
      const sort = {...activeSort.value};
      const filters = activeFilters.value.reduce((acc, f) => {
        if (!acc[f.key]) return {...acc, [f.key]: [f.value]};
        return {...acc, [f.key]: [...acc[f.key], f.value]};
      }, {});
      const skip = currentPage.value * pageSize.value;

      await gamesStore.fetchConfigs({ filters, sort, skip, limit: pageSize.value });
    } catch(err) {
        console.error(err);
    }
}

watch(
    [() => activeFilters.value, () => activeSort.value, () => currentPage.value],
    () => {
      if (filtersTimer.value) clearTimeout(filtersTimer.value)

      filtersTimer.value = setTimeout(() => {
        handleFetchConfigs()
      }, 500)
    },
    { deep: true }
)

onMounted(() => {
  handleSetActiveSort(sortOptions[0]);
})
</script>