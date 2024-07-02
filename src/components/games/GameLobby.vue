<template>
    <div v-for="user in data.users">
        <div class="flex flex-row items-center gap-3">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M17 19C17 17.4087 16.3679 15.8826 15.2426 14.7574C14.1174 13.6321 12.5913 13 11 13M11 13C9.4087 13 7.88258 13.6321 6.75736 14.7574C5.63214 15.8826 5 17.4087 5 19M11 13C13.2091 13 15 11.2091 15 9C15 6.79086 13.2091 5 11 5C8.79086 5 7 6.79086 7 9C7 11.2091 8.79086 13 11 13ZM21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z"
                    stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="truncate text-white flex flex-row items-center gap-2">
                <span>{{ user.username }}</span>
                <span v-if="user.isOwner">
                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 17H18M1 1L4 13H18L21 1L15 8L11 1L7 8L1 1Z" stroke="#E8B914" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useSocketStore } from '@/modules/socket/socket.store';

const socketStore = useSocketStore();
const data = computed(() => socketStore.getRoomData)
const roomId = computed(() => socketStore.getRoomId)
const socket = computed(() => socketStore.getSocket)

onMounted(() => {
    socket.value?.emit('game:speedrundle:get-data', roomId.value)
})
</script>