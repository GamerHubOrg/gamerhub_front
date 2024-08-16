<template>
  <div class="w-full overflow-x-auto">
    <table class="w-full rounded-md max-w-full">
      <thead class="bg-dark2">
        <tr>
          <th class="py-3 px-3 rounded-tl-md">{{ $t("games.speedrundle.record.rank") }}</th>
          <th class="px-3">{{ $t("profile.profileTab.username") }}</th>
          <th class="rounded-tr-md px-3">Total</th>
          <th v-for="character in charactersToGuess" :key="character._id" class="whitespace-pre px-3">
            {{ character.name }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(user, i) in usersResults" :key="user._id" class="bg-white bg-opacity-10">
          <td class="" :class="{ 'rounded-bl-md': i === usersResults.length - 1 }">
            <div class="text-3xl font-bold font-serif text-center" :class="getRankColor(user.rank)">
              {{ user.rank }}
            </div>
          </td>
          <td>
            <div class="flex items-center gap-x-4 text-xs w-fit mx-auto">
              <img :src="user.picture" alt="" class="h-6 w-6 rounded-full bg-gray-800" />
              <div class="font-medium leading-6 text-white">
                <span v-if="user._id !== currentUser._id">{{
                  user.username
                }}</span>
                <span v-else class="text-green-400">{{ $t("shared.me") }}</span>
              </div>
            </div>
          </td>
          <td class="text-center">
            {{ user.totalScore }}
          </td>
          <td v-for="(character, i) in charactersToGuess" :key="character._id" class="text-center">
            {{ user.scores[i] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { IMinifiedUser, User } from "@/modules/auth/user";
import { computed } from "vue";
import { useAuthStore } from "@/modules/auth/auth.store";
import { ICharacter, ISpeedrundleAnswer } from "../speedrundle.types";
import { useI18n } from "vue-i18n";

const { locale } = useI18n({ useScope: "local" })
const props = defineProps<{
  charactersToGuess: Partial<ICharacter>[];
  users: IMinifiedUser[];
  usersAnswers: ISpeedrundleAnswer[];
}>();
const store = useAuthStore();

const currentUser = computed(() => store.getCurrentUser as User);

const charactersToGuess = computed(() => props.charactersToGuess.map((c) => ({ ...c, name: getCharacterName(c) })) ?? []);

interface IUserResult {
  _id: string;
  username: string;
  picture?: string;
  scores: number[];
  totalScore: number;
  rank: number;
}

const usersResults = computed(() => {
  const results: IUserResult[] = [];
  const users = props.users;
  for (const { _id, username, picture } of users) {
    const answers = props.usersAnswers.find(({ playerId }) => playerId === _id);
    if (!answers) continue;
    const totalScore = answers.roundsData.reduce(
      (prev, curr) => prev + curr.score,
      0
    );
    results.push({
      _id,
      username,
      picture,
      scores: answers.roundsData.map(({ score }) => score),
      totalScore,
      rank: 0,
    });
  }

  results.sort((a, b) => b.totalScore - a.totalScore);

  let currentRank = 1;
  for (let i = 0; i < results.length; i++) {
    if (i > 0 && results[i].totalScore < results[i - 1].totalScore) {
      currentRank = i + 1;
    }
    results[i].rank = currentRank;
  }

  return results;
});

function getRankColor(rank: number) {
  switch (rank) {
    case 1:
      return "text-glow text-yellow-500";
    case 2:
      return "text-glow text-gray-300";
    case 3:
      return "text-glow text-yellow-600";
    default:
      return "text-white";
  }
}

function getCharacterName({ names, ...c }: Partial<ICharacter>) {
  const name = names?.[locale.value as keyof object];
  if (!name)
    return c.name; 
  return name
}
</script>

<style scoped>
.text-glow {
  text-shadow: 0 0 8px currentColor;
}
</style>
