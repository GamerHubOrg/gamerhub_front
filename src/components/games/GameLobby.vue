<template>
    <h2 class="text-3xl text-center mb-3">{{ $t("lobby.waitingRoom") }}</h2>
    <p class="mb-6 text-center">{{ $t("lobby.soonStart") }}</p>
    <div class="flex flex-wrap gap-5 justify-center">
        <div v-for="user in data.users" class="flex flex-col items-center gap-3 p-5 bg-white bg-opacity-[6%] rounded">
            <img :src="user.picture" class="w-32 h-32 rounded" />
            <div class="text-white flex flex-row items-center gap-2">
                <span :class="{'text-primary' : currentUser?._id === user._id}">{{ user.username }} {{ currentUser?._id === user._id ? `(${$t("shared.me")})` : "" }}</span>
                <span v-if="user.isOwner">
                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 17H18M1 1L4 13H18L21 1L15 8L11 1L7 8L1 1Z" stroke="#E8B914" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
            </div>
            <div v-if="isOwner && user._id !== currentUser?._id" class="flex flex-col gap-2">
                <button class="bg-[#E8B9141A] text-[#E8B914] rounded-lg px-3 py-1.5 text-sm"
                    @click="handlePromoteUser(user._id)">
                    {{ $t("lobby.roomSettings.promote") }}
                </button>
                <button class="bg-[#E847471A] text-[#E84747] rounded-lg px-3 py-1.5 text-sm"
                    @click="handleKickUser(user._id)">
                    {{ $t("lobby.roomSettings.kick") }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useSocketStore } from '@/modules/socket/socket.store';
import { useAuthStore } from '@/modules/auth/auth.store';

const socketStore = useSocketStore();
const authStore = useAuthStore();

const currentUser = computed(() => authStore.getCurrentUser);
const data = computed(() => socketStore.getRoomData)
const roomId = computed(() => socketStore.getRoomId)
const socket = computed(() => socketStore.getSocket)
const roomUsers = computed(() => data.value?.users ?? []);

const isOwner = computed(() => roomUsers.value.some(
    ({ email, isOwner }) => email === currentUser.value?.email && !!isOwner
));

const handlePromoteUser = (id: string) => {
    if (!isOwner.value) {
        return;
    }

    if (data.value.gameState !== "lobby") {
        return;
    }

    socketStore.handlePromoteUser(id);
};

const handleKickUser = (id: string) => {
    if (!isOwner.value) {
        return;
    }

    if (data.value.gameState !== "lobby") {
        return;
    }

    socketStore.handleKickUser(id);
};

onMounted(() => {
    socket.value?.emit('game:speedrundle:get-data', roomId.value)
})
</script>