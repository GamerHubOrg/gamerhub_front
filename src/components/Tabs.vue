<template>
    <div class="mb-6">
        <div class="sm:hidden">
            <label for="tabs" class="sr-only">Select a tab</label>
            <select @change="(e : any) => handleChange(e.target.value)" id="tabs" name="tabs"
                class="bg-transparent block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm">
                <option class="bg-dark1" v-for="tab in tabs" :key="tab.name" :value="tab.value">{{ tab.name }}</option>
            </select>
        </div>
        <div class="hidden sm:block">
            <div class="border-b border-gray-200">
                <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                    <span
                    @click="() => handleChange(tab.value)"
                     v-for="tab in tabs" :key="tab.name"
                     class="cursor-pointer"
                        :class="[props.selected === tab.value ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium']"
                        :aria-current="props.selected === tab.value ? 'page' : undefined">{{ tab.name }}</span>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface ITab {
    name: string,
    value: string,
}
const props = defineProps<{ tabs: ITab[], selected: string }>()
const emit = defineEmits(["change"]);

const handleChange = (value: string) => {
    emit("change", value);
}
</script>