<template>
    <div class="min-h-screen h-full">
        <Navbar />
        <Lobby v-show="!isLobbyCollapsed" />
        <GameRules v-show="!isGameRulesCollapsed" />

        <main class="p-4 h-full pt-24 xl:max-w-screen-xl w-full mx-auto">
            <router-view />
        </main>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, watch} from "vue";
import Lobby from "../components/Lobby.vue";
import Navbar from "../components/Navbar.vue";
import {useAuthStore} from "../modules/auth/auth.store";
import {useGamesStore} from "@/modules/games/games.store";
import {useRoute, useRouter} from "vue-router";
import GameRules from "@/components/GameRules.vue";
import Typebot from '@typebot.io/js/dist/web'

const store = useAuthStore();
const gamesStore = useGamesStore();
const router = useRouter();
const route = useRoute();
const routeNeedAuth = computed(() => route.meta?.requireAuth || false);
const currentUser = computed(() => store.currentUser);

const isLobbyCollapsed = computed(() => gamesStore.isLobbyCollapsed);
const isGameRulesCollapsed = computed(() => gamesStore.isGameRulesCollapsed);


async function handleSyncUserInfo() {
    try {
        await store.getMe();

        Typebot.initBubble({
            typebot: "customer-support",
            apiHost: "https://typebot.lucashost.fr",
            theme: {
                button: { backgroundColor: "#0d9488" },
                chatWindow: { backgroundColor: "#fff" },
            },
        });
    } catch (err) {
        store.setCurrentUser(undefined);

        if (routeNeedAuth.value) {
            router.replace("login");
        }
    }
}

onMounted(async () => {
    await handleSyncUserInfo();
});

watch(
    () => route.fullPath,
    () => {
        if (routeNeedAuth.value && !currentUser.value) {
            router.replace("login");
        }
    }
);
</script>
