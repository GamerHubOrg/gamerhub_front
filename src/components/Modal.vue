<template>
    <TransitionRoot as="template" :show="open">
        <Dialog class="relative z-50" @close="$emit('close')">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-dark5 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-50 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel class="relative transform overflow-hidden rounded-lg bg-dark1 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 text-white">
                            <slot />
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ref, watch } from 'vue';

const emit = defineEmits(['close'])
const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    autoclose: {
        type: Number,
        default: undefined,
    }
})

const timer = ref();

function handleSetAutocloseTimer() {
    if (timer.value) clearTimeout(timer.value);
    timer.value = setTimeout(() => emit('close'), props.autoclose);
}

watch(
    () => props.open,
    () => {
        if (props.open && props.autoclose) handleSetAutocloseTimer();

        if (!props.open) clearTimeout(timer.value);
    }
)
</script>