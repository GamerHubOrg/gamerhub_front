<template>
    <div>
        <div class="flex flex-row gap-2 flex-wrap">
            <VotePlayer
                v-for="user in users" :key="user._id" 
                :user="user"
                :type="type"
                @click="() => handleSendVoteProposition(user._id)"
            />
        </div>

        <div class="flex flex-col mt-6 gap-2">
            <span v-for="vote in tmpVotes" :key="vote.playerId">
                {{ getPlayerName(vote.playerId) }} want to vote for {{ getPlayerName(vote.vote) }}
            </span>
        </div>

        <div class="flex flex-col mt-6 gap-2">
            <span v-for="vote in wolfVotes" :key="vote.playerId">
                {{ getPlayerName(vote.playerId) }} voted for {{ getPlayerName(vote.vote) }}
            </span>
        </div>

        {{ tmpVotes }}
        <p>----------</p>
        {{ villageVotes }}

        <button 
            class="bg-primary text-white w-full p-1 rounded mt-6 hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleSendVote"
            :disabled="hasVoted"
        >
            {{ hasVoted ? 'Waiting for everyone to vote' : 'Confirm vote' }}
        </button>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/auth.store';
import VotePlayer from './VotePlayer.vue';
import { computed } from 'vue';
import { useSocketStore } from '@/modules/socket/socket.store';
import { IWerewolvesRoomData } from './werewolves.types';

const emit = defineEmits(['vote']);
const props = defineProps({
    users: {
        type: Array,
        default: () => [],
    },
    type: {
        type: String,
        enum: ['village', 'wolf'],
        default: 'wolf'
    }
})

const store = useAuthStore();
const socketStore = useSocketStore();

const stateData = computed(() => socketStore.getRoomData)
const socket = computed(() => socketStore.getSocket);
const roomId = computed(() => socketStore.getRoomId);

const currentUser = computed(() => store.getCurrentUser);
const roomData = computed(() => (stateData.value as IWerewolvesRoomData));
const gameData = computed(() => roomData.value.gameData);
const tmpVotes = computed(() => gameData.value?.tmpVotes || []);
const wolfVotes = computed(() => gameData.value?.wolfVotes || []);
const villageVotes = computed(() => gameData.value?.villageVotes || []);

const hasVoted = computed(() => {
    if (props.type === 'village') {
        return !!villageVotes.value.find((v) =>  (!v.turn || v.turn === gameData.value?.turn) &&  v.playerId === currentUser.value?._id);
    }

    return !!wolfVotes.value.find((v) =>  (!v.turn || v.turn === gameData.value?.turn) &&  v.playerId === currentUser.value?._id);
})

function getPlayerName(userId?: string) {
    return props.users.find((u) => u._id === userId)?.username || 'unknwown';
}

function handleSendVote() {
    const userVote = tmpVotes.value.find((v) => v.playerId === currentUser.value?._id);
    emit('vote', userVote?.vote)
}

function handleSendVoteProposition(userId: string) {
    const alreadyVotedUser = tmpVotes.value.find((vote) => vote.vote === userId && vote.playerId === currentUser.value?._id)
    if (alreadyVotedUser) {
        socket.value?.emit('game:werewolves:vote:tmp', { roomId: roomId.value, userId: currentUser.value?._id, vote: undefined });
        return;
    }

    socket.value?.emit('game:werewolves:vote:tmp', { roomId: roomId.value, userId: currentUser.value?._id, vote: userId });
}
</script>