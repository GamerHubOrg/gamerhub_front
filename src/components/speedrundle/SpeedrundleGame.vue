<template>
    <div class="flex flex-col items-center gap-7">
        <h2 class="text-3xl">Speedrun Dle</h2>
        <p>Le thème de la partie est : <span class="font-semibold">{{ roomCong?.theme }} : {{ roomCong?.mode }}</span>
        </p>
        <div class="absolute right-0 flex flex-col gap-1">
            <div v-for="user in roomData.users" :key="user.socket_id" class="flex justify-center items-center">
                <div class="flex items-center gap-2 max-w-48 max-h-12 p-3 rounded-md"
                    :class="currentUser?.email === user.email ? 'bg-lightgrey' : 'bg-darkgrey'">
                    <div class="max-h-12 max-w-12 text-xs truncate ">
                        <img :src="user.picture" class="W-full rounded-md">
                        <span class="text-xs truncate">{{ user.username }} </span>
                    </div>
                    <span class="font-semibold text-xs">Score : {{ getUserScore(user._id) }}</span>
                </div>
            </div>
        </div>

        <Select :value="characterGuessId" @update="handleCharacterSelect" :hide-options="true" :query-starts-with="true"
            :options="filteredCharacters?.map(({ _id, name, data }) => ({ value: _id, label: name, imageUrl: data.sprite }))" />

        <div class="w-3/4">
            <table class="border-collapse bg-dark2 w-full">
                <thead>
                    <tr>
                        <th v-for=" column  in  gameData?.columns ">
                            {{ column.name }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="guess in guessedCharacters.reverse()">
                        <th v-for=" column  in  gameData?.columns ">
                            <img v-if="column.type === 'image'" :src="guess[column.key]" class="mx-auto" />
                            <p v-else>{{ guess[column.key] }}</p>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/auth.store';
import { User } from '@/modules/auth/user';
import { useSocketStore } from '../../modules/socket/socket.store';
import { computed, ref, watch } from 'vue';
import { ILolCharacter, ISpeedrundleGameData, ISpeedrundleRoomData } from './speedrundle.types';
import Select from "@/components/Select.vue"
import { capitalizeFirstLetter } from '../../utils/functions';

const store = useAuthStore();
const socketStore = useSocketStore();

const stateData = computed(() => socketStore.getRoomData)
const roomId = computed(() => socketStore.getRoomId)
const socket = computed(() => socketStore.getSocket)

const currentUser = computed(() => (store.getCurrentUser as User))
const roomData = computed(() => (stateData.value as ISpeedrundleRoomData));
const roomCong = computed(() => roomData.value.config);
const gameData = computed(() => roomData.value.gameData as ISpeedrundleGameData);

const characterGuessId = ref<string>("");
const charactersToGuess = ref<ILolCharacter[]>(gameData.value.charactersToGuess as ILolCharacter[]);
const charactersRemaining = ref<ILolCharacter[]>(gameData.value.allCharacters as ILolCharacter[]);
const guessedCharacters = computed(() => {
    const userAnswers = gameData.value.usersAnswers.find(({ playerId }) => playerId === currentUser.value._id)
    if (!userAnswers) return [];
    const { guesses, currentRound } = userAnswers
    return guesses[currentRound - 1].map((characterId) => formatCharacter(characterId))
})


function getUserScore(userId: string): number {
    // const scoreEntry = gameData?.value?.score?.find((score: ISpeedrundleScore) => score.playerId === userId);
    // return scoreEntry ? scoreEntry.points : 0;
    return 0
}

const query = ref('')
const filteredCharacters = computed(() =>
    query.value === ''
        ? charactersRemaining.value
        : charactersRemaining.value.filter((person) => {
            return person.name.toLowerCase().includes(query.value.toLowerCase())
        })
)

function formatLolCharacter(characterData: ILolCharacter) {
    const sprite = characterData.data.sprite;
    const name = characterData.name;
    const tags = characterData.data.tags.join(", ");
    const ressource = characterData.data.ressource;
    const rangeObjets = characterData.data.range.map((e) => capitalizeFirstLetter(e))
    const range = rangeObjets.length > 1 ? rangeObjets.join(", ") : rangeObjets[0];
    const position = characterData.data.position.join(", ")
    return { sprite, name, tags, ressource, range, position }
}

function formatCharacter(id: string) {
    const characterData = gameData.value.allCharacters.find(({ _id }) => _id === id) as ILolCharacter | undefined;
    if (!characterData) return undefined;

    switch (roomData.value.config?.theme) {
        case "league_of_legends":
            return formatLolCharacter(characterData)

        default:
            break;
    }
}

function handleCharacterSelect(id: string) {
    console.log("select", id);
    characterGuessId.value = id;
}

function handleSendCharacter() {
    socket.value?.emit("game:speedrundle:guess", roomId.value, currentUser.value._id, characterGuessId.value)
    console.log("send");
    
    characterGuessId.value = "";
    // if (!characterForm.value || characterForm.value.trim() === '') return;
    // //socket.value?.emit("game:speedrundle:send-character", { roomId: roomId.value, userId: currentUser, character: characterForm.value});
    // //TODO : A décaler dans le socket back
    // let currentUserScore = getUserScore(currentUser.value.id) || 0
    // const index = roomCong?.value?.nbRounds ? roomCong?.value?.nbRounds - 1 : 0
    // console.log(currentUserScore, charactersToGuess.value[index].name)
    // if (charactersToGuess.value[index].name === characterForm.value) {
    //     currentUserScore += 100;
    //     console.log("Bravo, vous avez trouvé le bon personnage ! ", characterForm.value)
    // } else {
    //     console.log("Dommage, vous avez trouvé le mauvais personnage ! ", characterForm.value)
    // }
    // characterForm.value = undefined;
}

socket.value?.on("game:speedrundle:data", ({ data }: { data: any }) => {
    console.log("speedrundle data", data);
    stateData.value.gameData = data;
    charactersToGuess.value = data.charactersToGuess;
    charactersRemaining.value = data.allCharacters;
})

watch(
    () => characterGuessId.value,
    (newVal) => {
        console.log("watch guess id", newVal);

        if (newVal)
            handleSendCharacter()
    },
)


</script>