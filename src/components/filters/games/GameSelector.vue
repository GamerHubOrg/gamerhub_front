<template>
    <div class="mb-2">
        <div class="relative flow-root">
            <PopoverGroup class="-mx-4 flex items-center divide-x divide-gray-200">
                <Popover class="relative inline-block px-4 text-left">
                    <PopoverButton
                        class="group inline-flex justify-center text-sm font-medium text-gray-200 hover:text-gray-400">
                        <span>Games</span>
                        <span v-if="selectedOptions.length > 0"
                            class="ml-1.5 rounded bg-dark1 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-300">
                            {{ selectedOptions.length }}
                        </span>
                        <ChevronDownIcon class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-white group-hover:text-gray-200"
                            aria-hidden="true" />
                    </PopoverButton>

                    <transition enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
                        <PopoverPanel
                            class="absolute left-0 z-10 mt-2 origin-top-right rounded-md bg-dark2 p-4 shadow-2xl ring-1 ring-gray-400 ring-opacity-5 focus:outline-none">
                            <form class="space-y-4">
                                <div v-for="(option, optionIdx) in gameFilters" :key="option.value"
                                    class="flex items-center">
                                    <input :id="`game-filters-${optionIdx}`" :name="`game-filters[]`"
                                        :value="option.value" type="checkbox"
                                        :checked="selectedOptions.some((e) => e.value === option.value)"
                                        class="h-4 w-4 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        @change="() => handleFilterChange(option)" />
                                    <label :for="`game-filters-${optionIdx}`"
                                        class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-400">{{
                                            option.label
                                        }}</label>
                                </div>
                            </form>
                        </PopoverPanel>
                    </transition>
                </Popover>
            </PopoverGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    PopoverGroup,
    Popover,
    PopoverButton,
    PopoverPanel,
} from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { IOption } from "./game-filters.types";

const emit = defineEmits(["change"]);
const props = defineProps<{ selectedOptions: IOption[] }>()

const gameFilters = [
    { value: "undercover", label: "Undercover" },
    { value: "speedrundle", label: "SpeedrunDLE" },
    { value: "werewolves", label: "Werewolves" },
]

function handleFilterChange(selected: IOption) {
    const alreadyExist = props.selectedOptions.some((e) => e.value === selected.value);
    if (!alreadyExist) {
        emit("change", [...props.selectedOptions, selected]);
        return;
    }

    emit("change", props.selectedOptions.filter((e) => e.value !== selected.value));
}
</script>import { IActiveFilter, IConfigFilter, IConfigFilterOption } from "./game-filters.types";
