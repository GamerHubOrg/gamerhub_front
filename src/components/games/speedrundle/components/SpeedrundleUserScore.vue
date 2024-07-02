<template>
    <div class="flex gap-1 
      min-[700px]:absolute min-[700px]:top-20 min-[700px]:right-16 min-[700px]:flex-col min-[700px]:overflow-y-auto min-[700px]:h-[150px] 
      max-[700px]:overflow-x-auto max-[700px]:w-[350px] ">
      <div v-for="user in roomData.users" :key="user.socket_id" class="flex justify-center items-center">
        <div class="flex items-center gap-2 max-w-48 max-h-12 p-3 rounded-md" :class="{
          'bg-lightgrey': currentUser?.email === user.email,
          'bg-darkgrey': currentUser?.email !== user.email,
          'border border-green-500': scores[user._id]?.state === 'finished'
        }">
          <div class="max-h-12 max-w-12 text-xs truncate">
            <img :src="user.picture" class="w-full rounded-md" />
            <span class="text-xs truncate">{{ user.username }} </span>
          </div>
          <span class="font-semibold text-xs">Score : {{ scores[user._id].score }}</span>
        </div>
      </div>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/auth.store';
import { useSocketStore } from '@/modules/socket/socket.store';
import { computed } from 'vue';
import { ISpeedrundleGameData, ISpeedrundleRoomData } from '../speedrundle.types';
import { User } from '@/modules/auth/user';

const authStore = useAuthStore();
const socketStore = useSocketStore();

const stateData = computed(() => socketStore.getRoomData);
const roomData = computed(() => stateData.value as ISpeedrundleRoomData);
const currentUser = computed(() => authStore.getCurrentUser as User);
const gameData = computed(() => roomData.value.gameData as ISpeedrundleGameData);
const scores = computed(() => {
  const scoresObject: Record<
    string,
    { score: number; state: "finished" | "playing" }
  > = {};
  for (const { _id } of roomData.value.users) {
    const key = _id as keyof object;
    const answers = gameData.value.usersAnswers?.find((e) => _id === e.playerId);
    const score = answers?.roundsData.reduce((prev, curr) => prev + curr.score, 0) || 0;
    const state = answers?.state || "playing";
    scoresObject[key] = { score, state };
  }

  return scoresObject;
});
</script>