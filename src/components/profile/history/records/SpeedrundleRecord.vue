<template>
    <div class="flex max-[800px]:flex-col w-full h-full min-[801px]:gap-5 relative after:absolute after:left-0 after:top-0 after:h-full after:w-2 after:bg-white"
        :class="{ 'after:bg-yellow-500': currentRank?.rank === 1, 'after:bg-gray-300': currentRank?.rank === 2, 'after:bg-yellow-600': currentRank?.rank === 3, 'after:!bg-red-500': currentRank?.totalScore === 0 }">
        <div class="flex relative main">
            <div
                class="text-xs min-[801px]:text-base flex h-full justify-between py-2 px-6 max-[800px]:items-center max-[800px]:w-full max-[800px]:justify-between min-[801px]:flex-col min-[801px]:w-[200px]">
                <div class="flex max-[800px]:gap-5 min-[801px]:flex-col">
                    <p class="font-bold">Speedrundle</p>
                    <i>{{ $t('profile.historyTab.ago', { time: timeAgo }) }}</i>
                </div>
                <hr class="max-[800px]:hidden opacity-30">
                <p class="font-bold">{{ $t('games.speedrundle.record.rank', { time: timeAgo }) }} : {{ currentRank?.rank
                    }}</p>
            </div>
            <span class="max-[800px]:hidden h-full min-w-[1px] w-[1px] bg-white opacity-30"></span>
        </div>
        <div class="text-xs h-full min-[801px]:text-base flex gap-5 max-[800px]:pl-5">
            <div class="py-1 min-[801px]:py-2">
                <div class="mx-auto flex flex-col gap-2 justify-center w-[100px]">
                    <div v-for="user in ranking.slice(0, 3)" class="flex items-center gap-1"
                        :class="{ 'text-green-400': currentUser?._id === user.playerId }">
                        <span>{{ user.rank }}</span>
                        -
                        <img :src="user.picture" class="w-5 h-5 rounded-full object-cover" />
                        <span class="truncate">{{ currentUser?._id === user.playerId ? $t('shared.me')
                            : user.username || $t('games.speedrundle.record.unknown') }}</span>
                    </div>
                </div>
            </div>
            <span class="max-[550px]:hidden h-full min-w-[1px] w-[1px] bg-white opacity-30"></span>
            <div class="max-[550px]:hidden text-xs min-[801px]:text-sm py-2" v-if="currentRank">
                <div class="w-[120px] min-[801px]:w-[140px] mx-auto">
                    <p>{{ $t("games.speedrundle.record.totalScore") }} : {{ currentRank.totalScore }}</p>
                    <p>{{ $t("games.speedrundle.record.averageScore") }} : {{ avgScore }}</p>
                    <p>{{ $t("games.speedrundle.record.maxScore") }} : {{ Math.max(...currentRank.scores) }}</p>
                    <p>{{ $t("games.speedrundle.record.minScore") }} : {{ Math.min(...currentRank.scores) }}</p>
                </div>
            </div>
            <span class="h-full min-w-[1px] w-[1px] bg-white opacity-30"></span>
            <div :id="id + '-characters'" class="py-2 text-xs">
                <p class="mb-1 whitespace-nowrap truncate">{{ $t("games.speedrundle.record.charactersToGuess") }} :</p>
                <div class="flex flex-wrap gap-1 max-h-[34px] min-[801px]:max-h-[68px] overflow-hidden">
                    <div v-for="character in record.charactersData.slice(0, maxVisibleCharacters)">
                        <img :src="character.data?.sprite" class="w-8 h-8 rounded-full object-cover" />
                    </div>
                    <div v-if="record.charactersData.length > maxVisibleCharacters"
                        class="bg-white text-black font-bold w-8 h-8 rounded-full flex items-center justify-center">
                        +{{ record.charactersData.length - maxVisibleCharacters }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ISpeedrundleRecord } from '@/modules/auth/gameRecords';
import { useAuthStore } from '@/modules/auth/auth.store';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { getTimeAgo } from './records.functions';

const authStore = useAuthStore();
const props = defineProps<{ record: ISpeedrundleRecord, id: string }>();
const currentUser = computed(() => authStore.getCurrentUser);
const ranking = computed(() => getRanking());
const currentRank = computed(() => ranking.value.find(({ playerId }) => playerId === currentUser.value?._id))
const timeAgo = computed(() => getTimeAgo(props.record.createdAt))
const maxVisibleCharacters = ref<number>(calculateMaxVisibleCharacters());
const avgScore = computed(() => {
    if (!currentRank.value) return;
    const value = currentRank.value.totalScore / (currentRank.value.scores.length || 1);
    return Math.round(value)
})

function calculateMaxVisibleCharacters(): number {
    const { innerWidth } = window;

    let baseNumberOfImages = 35;
    const imageSize = 32;
    const gap = 4;
    let baseWidth = 1267 + imageSize + gap;
    if (innerWidth > baseWidth) return baseNumberOfImages;
    let nbLines = 2;

    const bp1 = 800;

    if (innerWidth <= bp1) {
        baseWidth = 786 + imageSize + gap;
        baseNumberOfImages = 10;
        nbLines = 1;
    }

    const bp2 = 549;
    if (innerWidth <= bp2) {
        baseWidth = 517 + imageSize + gap;
        baseNumberOfImages = 7;
    }

    const difference = baseWidth - innerWidth;
    const charactersToRemove = Math.ceil(difference / (imageSize + gap)) - 1
    return baseNumberOfImages - charactersToRemove * nbLines;
}

function handleResize() {
    maxVisibleCharacters.value = calculateMaxVisibleCharacters();
}

onMounted(() => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

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
        background-image: url("../../../../assets/games/speedrundle.webp");
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