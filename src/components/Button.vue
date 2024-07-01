<template>
  <button :class="buttonClass">
    <div class="absolute centerAbsolute flex gap-2 justify-center items-center">
      <svg v-if="isLoading" class="m-0 animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
    </div>
    <span class="px-1.5 py-0.5 flex gap-2 justify-center items-center text-white" :class="[isLoading && 'invisible']">
      <slot />
    </span>
  </button>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: false
  },
  type: {
    type: String,
    validator: (val: string) => ['primary', 'secondary', 'classic', 'danger'].includes(val),
    default: 'classic',
    required: false
  },
  shape: {
    type: String,
    validator: (val: string) => ['round', 'squared'].includes(val),
    default: 'round',
    required: false
  },
  selected: {
    type: Boolean,
    required: false
  }
});

const buttonClass = computed(() => {
  let classes: Record<string, boolean> = {
    'relative inline-flex items-center justify-center gap-1 bg-primary px-3 py-0.5 hover:brightness-[85%] duration-200': props.type === 'primary',
    'relative inline-flex items-center justify-center gap-1 bg-secondary px-3 py-0.5 hover:brightness-[85%] duration-200': props.type === 'secondary',
    'relative inline-flex items-center justify-center gap-1 px-3 py-0.5 hover:bg-zinc-800 duration-200': props.type === 'classic',
    'relative inline-flex items-center justify-center gap-1 bg-red-600 px-3 py-0.5': props.type === 'danger',
    'bg-zinc-800' : props.type === 'classic' && props.selected,
  }
  classes = {
    ...classes,
    'rounded-2xl': props.shape === 'round',
    'rounded-md': props.shape === 'squared'
  }
  return classes;
})
</script>

<style scoped>
.centerAbsolute {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
