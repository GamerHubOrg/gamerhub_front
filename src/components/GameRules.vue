<script setup lang="ts">
import {useGamesStore} from "@/modules/games/games.store";
import Undercover from "@/rules/Undercover.vue";
import Werewolves from "@/rules/Werewolves.vue";
import Speedrundle from "@/rules/Speedrundle.vue";
import {computed} from "vue";

const gamesStore = useGamesStore();

const handleOpenLobby = () => {
    gamesStore.setIsGameRulesCollapsed(true);
};

const gameComponents: { [key: string]: Function } = {
    'undercover': Undercover,
    'werewolves': Werewolves,
    'speedrundle': Speedrundle,
};

const gameName = computed(() => gamesStore.gameName);
const currentComponent = computed(() => {
    const gameName = gamesStore.gameName;
    return gameComponents[gameName] || null;
});


</script>

<template>
    <div class="fixed right-0 top-0 p-6 h-full bg-dark2 z-50 w-full overflow-y-auto md:max-w-[480px] pb-6">
        <div class="flex flex-row items-center justify-between mb-5">
            <h3 class="text-white text-2xl font-bold">Game Rules</h3>
            <button class="rounded bg-white bg-opacity-10 text-white p-2 text-sm" @click="handleOpenLobby">
                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 1.5L1 13.5M1 1.5L13 13.5" stroke="white" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" />
                </svg>
            </button>
        </div>

        <div>
            <component :is="currentComponent"></component>
        </div>
    </div>
</template>
