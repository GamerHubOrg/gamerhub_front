<template>
  <Popover>
    <PopoverButton>
      <div class="flex flex-row items-center gap-2" :class="{ 'pt-1': !notInteractive}">
        <img 
          :src="`/images/werewolves/icons/${role?.picture}.png`"
          class="w-10"
        />
        <span 
          :class="{[`font-bold text-${roleColor}`]: true}"
        >
          {{ user?.username }} ({{ role?.name }})
        </span>
      </div>
    </PopoverButton>
    <transition 
      v-if="!notInteractive"
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel class="absolute z-10">
        <div class="bg-dark5 rounded-xl p-3 flex flex-col items-center gap-1 max-w-64">
          <img 
            :src="`/images/werewolves/icons/${role?.picture}.png`"
            class="w-40"
          />
          <span class="font-bold">{{ role?.name }}</span>
          <span class="w-full text-center">{{ role?.power?.description }}</span>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script lang="ts" setup>
import { EWerewolvesRoleName, IWerewolvesPlayer, WerewolfRole } from "../werewolves.types";
import { rolesColor } from '../werewolves.constants';
import { computed } from "vue";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

const props = defineProps<{
  user?: IWerewolvesPlayer,
  role: WerewolfRole,
  notInteractive?: boolean;
}>()

const roleColor = computed(() => rolesColor[props.role?.name as EWerewolvesRoleName]);
</script>