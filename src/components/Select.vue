<template>
    <div :id="'custom-select-' + id" class="custom-select relative w-64">
        <div class="border border-gray-300 bg-white rounded-md shadow-sm p-2 cursor-pointer flex items-center justify-between"
            @click="toggleDropdown()">
            <div class="flex items-center">
                <img v-if="selectedOption.imageUrl" :src="selectedOption.imageUrl" alt=""
                    class="w-6 h-6 rounded-full mr-2">
                <input v-if="!hideSearch" v-model="searchQuery" type="text"
                    class="w-full p-2 border-b border-gray-300 focus:outline-none text-black" placeholder="Search...">
            </div>
            <span class="pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </span>
        </div>
        <!-- Options -->
        <div v-if="showDropdown"
            class="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-[300px] overflow-y-auto">
            <div v-if="filteredOptions.length > 0 || !hideOptions">
                <div v-for="option in filteredOptions" :key="option.value"
                    class="p-2 hover:bg-gray-100 cursor-pointer flex items-center" @click="selectOption(option)">
                    <img v-if="!!option.imageUrl" :src="option.imageUrl" alt="" class="w-6 h-6 rounded-full mr-2">
                    <span class="text-black">{{ option.label }}</span>
                </div>
                <div v-if="filteredOptions.length === 0 && !hideOptions" class="p-2 text-gray-400">No matching options
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, onUnmounted, computed } from 'vue';

interface IOption {
    value: string;
    label: string;
    imageUrl?: string;
}

const emit = defineEmits(['update'])
const props = defineProps<{
    options: IOption[];
    value: string;
    id?: string;
    hideOptions?: boolean;
    hideSearch?: boolean;
    queryStartsWith?: boolean;
}>();

const options = computed(() => props.options ?? [])

const selectedOption = computed(() => {
    const option = options.value.find((e) => e.value === props.value) || { value: '', label: 'Select a character' }
    searchQuery.value = option?.value;
    if (!option) return { value: '', label: 'Select a character' };
    return option;
})
const showDropdown = ref(false);
const searchQuery = ref('');

const toggleDropdown = (value?: boolean) => {
    showDropdown.value = value !== undefined ? value : !showDropdown.value;
    if (showDropdown.value) {
        setTimeout(() => {
            document.getElementById('search-input-' + props.id)?.focus();
        }, 0);
    }
};

// Select the clicked option
const selectOption = (option: IOption) => {
    showDropdown.value = false;
    searchQuery.value = option.label;
    emit('update', option.value);
};

// Get options based on search query
const filteredOptions = computed(() => {
    if (props.hideOptions && searchQuery.value === '') {
        return [];
    } else {
        return options.value.filter(option => {
            if (props.queryStartsWith) {
                return option.label.toLowerCase().startsWith(searchQuery.value.toLowerCase())
            }

            return option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
        }
        ).sort((a, b) => a.label.localeCompare(b.label));
    }
});

// Close the dropdown when clicked outside
onMounted(() => {
    const closeDropdown = (event: any) => {
        if (!event.target.closest('#custom-select-' + props.id)) {
            showDropdown.value = false;
        }
    };

    document.addEventListener('click', closeDropdown);

    onUnmounted(() => {
        document.removeEventListener('click', closeDropdown);
    });
});
</script>
