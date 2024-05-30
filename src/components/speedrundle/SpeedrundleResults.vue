<template>
  <div>
    <span>Le vainqueur est : {{ gameData.winner }}</span>

    <table class="border-collapse">
      <tr>
        <th>Username</th>
        <th>Mots</th>
        <th>Camp</th>
        <th>Etat de fin</th>
        <th>Mot</th>
      </tr>
      <tr v-for="user in roomData.users" :key="user.id">
        <td><span :class="{ 'font-bold': currentUser.id === user.id }">{{ user.username }}</span></td>
        <td>
          <div class="flex flex-col gap-2">
            <span v-for="(word, index) in getUserWords(user)" :key="`${user.id}-${index}`">
                {{ word.word }}
            </span>
          </div>
        </td>
        <td>
          <span>{{ gameData.undercoverPlayerIds?.includes(user.id) ? 'undercover' : 'civilian' }}</span>
        </td>
        <td>
          <span v-if="!user.isEliminated">Voted for : {{ getPlayerFromVote(user.id) }}</span>
          <span v-else>dead</span>
        </td>
        <td>{{ gameData.undercoverPlayerIds?.includes(user.id) ? gameData.spyWord : gameData.civilianWord }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { User } from '@/modules/auth/user';
import { IUndercoverGameData, IUndercoverRoomData } from '@/types/interfaces';
import { computed } from 'vue';
import { useSocketStore } from '../../modules/socket/socket.store';
import { useAuthStore } from '@/modules/auth/auth.store';

const store = useAuthStore();
const socketStore = useSocketStore();

const currentUser = computed(() => (store.getCurrentUser as User))
const roomData = computed(() => (socketStore.getRoomData as IUndercoverRoomData));
const gameData = computed(() => (roomData.value.gameData as IUndercoverGameData));
const votes = computed(() => gameData.value.votes || []);

function getUserWords(user: User) {
    return gameData.value?.words?.filter((word) => word.playerId === user.id);
}

function getUserName(userId: string) {
  const user = roomData.value.users.find((u) => u.id === userId);
  return user ? user.username : 'unknown';
}

function getPlayerFromVote(userId: string) {
  const vote = votes.value.find((v) => v.playerId === userId);
  if (!vote) return 'unknown';
  return getUserName(vote.vote);
}

</script>

<style scoped>
table, th, td {
  @apply border border-black;
}
</style>