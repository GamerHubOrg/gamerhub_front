<template>
    <div 
        class="rounded-lg border p-2 flex flex-row justify-center items-center gap-2 cursor-pointer relative h-36 min-w-20"
    >
        <span v-if="votesNumber > 0" class="absolute right-0 transform translate-x-1/2 -translate-y-1/2 top-0 rounded-full bg-primary text-white py-0.5 px-2.5">{{ votesNumber }}</span>
        <span>{{ user.username }}</span>
    </div>
</template>

<script lang="ts" setup>
import { useSocketStore } from "@/modules/socket/socket.store";
import { computed } from "vue";
import { IWerewolvesRoomData } from "./werewolves.types";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    type: {
        type: String,
        enum: ['village', 'wolf'],
        default: 'wolf'
    }
})

const socketStore = useSocketStore();

const stateData = computed(() => socketStore.getRoomData)

const roomData = computed(() => (stateData.value as IWerewolvesRoomData));
const gameData = computed(() => roomData.value.gameData);
const tmpVotes = computed(() => gameData.value?.tmpVotes || []);
const wolfVotes = computed(() => gameData.value?.wolfVotes || []);
const villageVotes = computed(() => gameData.value?.villageVotes || []);

const votesNumber = computed(() => {
    if (props.type === 'village') {
        return [...tmpVotes.value, ...villageVotes.value].filter((vote) => (!vote.turn || vote.turn === gameData.value?.turn) && vote.target === props.user._id).length;
    }
    
    return [...tmpVotes.value, ...wolfVotes.value].filter((vote) => (!vote.turn || vote.turn === gameData.value?.turn) && vote.target === props.user._id).length;
});
</script>