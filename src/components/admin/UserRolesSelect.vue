<template>
  <div class="w-full flex flex-col items-center mx-auto">
    <div class="w-full">
      <div class="flex flex-col items-center relative">
        <div class="w-full">
          <div
            class="my-2 p-1 flex border border-gray-700 bg-gray-800 rounded"
          >
            <div class="flex flex-auto flex-wrap">
              <div
                v-for="option in selectedOptions"
                :key="`selected-${option.value}`"
                class="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-primary bg-primary bg-opacity-25 border border-primary"
              >
                <div
                  class="text-xs font-normal leading-none max-w-full flex-initial"
                >
                  {{ option.label }}
                </div>
                <div class="flex flex-auto flex-row-reverse">
                  <div @click="() => selectOption(option)"                    >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="100%"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-700"
            >
              <button
                class="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none"
                @click="handleCollapseMenu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather w-4 h-4 feather-chevron-up transform"
                  :class="{
                    'rotate-180': !isMenuCollapsed,
                  }"
                >
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="!isMenuCollapsed"
          class="absolute shadow top-100 bg-gray-800 z-40 w-full lef-0 rounded max-h-select overflow-y-auto"
        >
          <div class="flex flex-col w-full">
            <div
              v-for="option in options"
              :key="option.value"
              class="cursor-pointer w-full border-gray-700 rounded-t border-b hover:bg-gray-600"
              @click="() => selectOption(option)"
            >
              <div
                class="flex w-full items-center p-2 pl-2 border-l-2 relative"
                :class="{
                  'border-primary': modelValue.includes(option.value),
                  'border-transparent hover:border-primary': !modelValue.includes(option.value),
                }"
              >
                <div class="w-full items-center flex">
                  <div 
                    class="mx-2 leading-6 text-sm"
                    :class="{
                      'text-primary': modelValue.includes(option.value),
                    }"
                  >
                    {{ option.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

interface IRolesSelectOption {
  label: string;
  value: string;
}

const emit = defineEmits(['update:model-value'])
const props = defineProps<{
  options: IRolesSelectOption[];
  modelValue: string[];
}>();

const isMenuCollapsed = ref(true);
const selectedOptions = computed(() => props.options.filter((option) => props.modelValue?.includes(option.value)));

function handleCollapseMenu(e) {
  e.preventDefault();
  isMenuCollapsed.value = !isMenuCollapsed.value;
}

function selectOption(option: IRolesSelectOption) {
  const isAlreadySelected = props.modelValue.includes(option.value);
  if (isAlreadySelected) {
    emit('update:model-value', [...props.modelValue.filter((v) => v !== option.value)]);
    return;
  }

  emit('update:model-value', [...props.modelValue, option.value]);
}
</script>

<style lang="scss" scoped>
.top-100 {
  top: 100%;
}
.bottom-100 {
  bottom: 100%;
}
.max-h-select {
  max-height: 300px;
}
</style>