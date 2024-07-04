<template>
    <div class=" flex w-full h-full gap-5 relative after:absolute after:left-0 after:top-0 after:h-full after:w-2 after:bg-white"
        :class="{ 'after:bg-red-500': currentRank?.totalScore === 0, 'after:bg-yellow-500': currentRank?.rank === 1, 'after:bg-gray-300': currentRank?.rank === 2, 'after:bg-yellow-600': currentRank?.rank === 3 }">
        <div class="flex relative main">
            <div class="flex flex-col gap-2 w-[200px] h-full justify-between py-2 px-6">
                <div>
                    <p>Speedrundle</p>
                    <p class="text-sm"><i>Il y a {{ timeAgo }}</i></p>
                </div>
                <hr class="opacity-30">
                <p>Rang : {{ currentRank?.rank }}</p>
            </div>
        <span class="h-full w-[1px] bg-white opacity-30"></span>
        </div>
        <div class="py-2">
            <div class="mx-auto flex flex-col gap-2 justify-center w-[100px]">
                <div v-for="user in ranking.slice(0, 2)" class="flex items-center gap-1">
                    <span>{{ user.rank }}</span>
                    -
                    <img :src="user.picture" class="w-5 h-5 rounded-full" />
                    <span>{{ user.username }}</span>
                </div>
            </div>
        </div>
        <span class="h-full w-[1px] bg-white opacity-30"></span>
        <div class="py-2" v-if="currentRank">
            <div class="w-[150px] mx-auto">
                <p>Total score : {{ currentRank.totalScore }}</p>
                <p>Average score : {{ currentRank.totalScore / (currentRank.scores.length || 1) }}</p>
                <p>Max score : {{ Math.max(...currentRank.scores) }}</p>
                <p>Min score : {{ Math.min(...currentRank.scores) }}</p>
            </div>
        </div>
        <span class="h-full w-[1px] bg-white opacity-30"></span>
        <div class="py-2">
            <p class="mb-1">Personnages à deviner :</p>
            <div class="flex flex-wrap gap-1 max-h-[68px] overflow-hidden">
                <div v-for="character in record.charactersData">
                    <img :src="character.data?.sprite" class="w-8 h-8 rounded-full" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ISpeedrundleRecord } from '@/modules/auth/gameRecords';
import { useAuthStore } from '@/modules/auth/auth.store';
import { computed } from 'vue';

const authStore = useAuthStore();
const props = defineProps<{ record: ISpeedrundleRecord }>();
const currentUser = computed(() => authStore.getCurrentUser);
const ranking = computed(() => getRanking());
const currentRank = computed(() => ranking.value.find(({ playerId }) => playerId === currentUser.value?._id))

const timeAgo = computed(() => getTimeAgo())

const getRanking = () => {
    const { usersAnswers } = props.record;

    if (!usersAnswers) return [];

    const userScores = usersAnswers.map(({ playerId, roundsData }) => {
        const scores = roundsData.reduce((prev, curr) => [...prev, curr.score], [] as number[]);
        const totalScore = scores.reduce((prev, curr) => prev + curr, 0);
        const user = props.record.usersData.find(({ _id }) => _id === playerId);
        return { totalScore, scores, playerId, username: user?.username, picture: user?.picture };
    });

    userScores.sort((a, b) => b.totalScore - a.totalScore);

    let rank = 1;
    let currentScore = userScores[0]?.totalScore;
    let currentRank = 1;

    return userScores.map((user, index) => {
        if (user.totalScore !== currentScore) {
            rank = index + 1;
            currentScore = user.totalScore;
            currentRank = rank;
        }

        return { ...user, rank: currentRank };
    });
}

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
        content : "";
        position : absolute;
        z-index : 0;
        top : 0;
        left : 0;
        width : 100%;
        height : 100%;
        background-image : url("../../../../assets/games/speedrundle.webp");
        background-size : cover;
        background-repeat : no-repeat;
        background-position : left;
        opacity : 0.15;
    }

    * {
        z-index : 0;
    }
}
</style>