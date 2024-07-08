<template>
    <div class="flex max-[800px]:flex-col w-full h-full min-[801px]:gap-5 relative after:absolute after:left-0 after:top-0 after:h-full after:w-2 after:bg-primary"
        :class="{ 'after:bg-red-500': !hasWon }">
        <div class="flex relative main">
            <div
                class="text-xs min-[801px]:text-base flex h-full justify-between py-2 px-6 max-[800px]:items-center max-[800px]:w-full max-[800px]:justify-between min-[801px]:flex-col min-[801px]:w-[200px]">
                <div class="flex max-[800px]:gap-5 min-[801px]:flex-col">
                    <p class="font-bold">Werewolves</p>
                    <i>Il y a {{ timeAgo }}</i>
                </div>
                <hr class="max-[800px]:hidden opacity-30">
                {{ currentRole?.camp }}
                <p class="font-bold text-primary" v-if="hasWon">
                    Victory : {{ capitalizeFirstLetter(record.campWin || "") }}</p>
                <p class="font-bold text-red-500" v-else>Defeat</p>
            </div>
            <span class="max-[800px]:hidden h-full min-w-[1px] w-[1px] bg-white opacity-30"></span>
        </div>
        <div class="max-[800px]:text-xs h-full min-[801px]:text-base flex gap-5 max-[800px]:pl-5">
            <div v-if="!!currentRole" class="flex flex-col justify-center items-center w-[100px]">
                <img :src="`/images/werewolves/icons/${currentRole.picture}.png`" class="h-16 w-16" />
                <p class="font-bold">{{ capitalizeFirstLetter(currentRole.name) }}</p>
            </div>
            <!-- <span class="h-full min-w-[1px] w-[1px] bg-white opacity-30"></span>
            <div class="flex flex-1 flex-col justify-center">
                <p class="line-clamp-2">Civilian word : {{ record.civilianWord }}</p>
                <p>Undercover word : {{ record.spyWord }}</p>
            </div> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import { IWerewolvesRecord } from '@/modules/auth/gameRecords';
import { useAuthStore } from '@/modules/auth/auth.store';
import { computed } from 'vue';
import { capitalizeFirstLetter } from '@/utils/functions';
import { IWerewolvesCamp } from '@/components/games/werewolves/werewolves.types';

const authStore = useAuthStore();
const props = defineProps<{ record: IWerewolvesRecord }>();
const currentUser = computed(() => authStore.getCurrentUser);
const timeAgo = computed(() => getTimeAgo())
const currentRole = computed(() => {
    if (!currentUser.value) return undefined;
    return props.record.roles[currentUser.value?._id]
});
const changedCamp = computed<IWerewolvesCamp | undefined>(() => {
    if (props.record.couple?.includes(currentUser.value?._id || "")) return "solo";
    return;
})

const hasWon = computed(() => {
    const myCamp = changedCamp.value || currentRole.value?.camp;
    if (myCamp === props.record.campWin) return true;
    return false;
})


const getTimeAgo = () => {
    const { createdAt } = props.record;
    const now = new Date();

    const diffMs = now.getTime() - new Date(createdAt).getTime();
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} jour${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
        return `${seconds} seconde${seconds > 1 ? 's' : ''}`;
    }
}

</script>

<style scoped lang="scss">
.main {
    &::before {
        content: "";
        position: absolute;
        z-index: 0;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url("../../../../assets/games/werewolves.webp");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: left;
        opacity: 0.15;
    }

    * {
        z-index: 0;
    }
}
</style>