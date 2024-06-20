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
                    <span class="font-semibold text-xs">Score : {{ scores[user._id] }}</span>
                </div>
            </div>
        </div>

        <Select :value="characterGuessId" @update="handleCharacterSelect" :hide-options="true" :query-starts-with="true"
            :options="filteredCharacters" />

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
                        <th v-for=" column  in  gameData?.columns" :class="getColumnClass(guess.id, column.key)">
                            <img v-if="column.type === 'image'" :src="guess[column.key as keyof object]"
                                class="mx-auto" />
                            <p v-else>{{ guess[column.key as keyof object] }}</p>
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
import { ISpeedrundleAnswer } from '../../../../gamerhub_back/socket/games/speedrundle/speedrundle.types';

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
const charactersToGuess = ref<ILolCharacter[]>([]);
const allCharacters = ref<ILolCharacter[]>([]);

const userAnswers = ref<ISpeedrundleAnswer>()

const currentCharacterToGuess = computed(() => {
    if (!userAnswers.value) return undefined
    const { currentRound } = userAnswers.value;
    return charactersToGuess.value[currentRound - 1];;
})

const guessedCharacters = computed(() => {
    if (!userAnswers.value) return [];
    const { guesses, currentRound } = userAnswers.value
    return guesses[currentRound - 1]?.map((characterId) => formatCharacter(characterId)).filter((e) => !!e) ?? []
})

const filteredCharacters = computed(() => {
    const chars = allCharacters.value
    if (!chars) return [];
    return chars.filter(({ _id }) => !guessedCharacters.value.some((e) => e.id === _id)).map(({ _id, name, data }) => ({ value: _id, label: name, imageUrl: data.sprite }))
})

const scores = computed(() => {
    const scoresObject: Record<string, number> = {};
    for (const { _id } of roomData.value.users) {
        const answers = gameData.value.usersAnswers?.find((e) => _id === e.playerId)
        scoresObject[_id as keyof object] = answers?.score ?? 0;
    }
    return scoresObject
})


function verifyArrayInclusion(array1: string[], array2: string[]) {
    const allGood = array1.every((tag) => array2.includes(tag)) && array2.every((tag) => array1.includes(tag))
    if (allGood) return "true"
    const someGood = allGood || array1.some((tag) => array2?.includes(tag))
    if (someGood) return "partial";
    return "false"

}

function getLolColumnClass(characterData: ILolCharacter, column: string) {
    const arraysColumns = ["tags", "range", "position"];
    const stringColumns = ["ressource", "gender"]

    if (arraysColumns.includes(column)) {
        const guess = characterData.data[column as keyof object];
        const toGuess = currentCharacterToGuess.value?.data[column as keyof object] ?? []
        const value = verifyArrayInclusion(toGuess, guess)
        return value === "true" ? "bg-green-500" : value === "partial" ? "bg-orange-500" : "bg-red-500";
    }

    if (stringColumns.includes(column)) {
        const guess = characterData.data[column as keyof object]
        const toGuess = currentCharacterToGuess.value?.data[column as keyof object]
        return guess === toGuess ? "bg-green-500" : "bg-red-500";
    }

    return characterData._id === currentCharacterToGuess.value?._id ? "bg-green-500" : "bg-red-500"
}

function getColumnClass(id: string, column: string) {
    const characterData = gameData.value.allCharacters.find(({ _id }) => _id === id) as ILolCharacter | undefined;
    if (!characterData) return "bg-red-500";

    switch (roomData.value.config?.theme) {
        case "league_of_legends":
            return getLolColumnClass(characterData, column)

        default:
            break;
    }
}

function formatLolCharacter(characterData: ILolCharacter) {
    const sprite = characterData.data.sprite;
    const { ressource } = characterData.data;
    const gender = characterData.data.gender === "male" ? "Masculin" : characterData.data.gender === "female" ? "Féminin" : "Autre";
    const tags = characterData.data.tags.join(", ");
    const rangeObjets = characterData.data.range.map((e) => capitalizeFirstLetter(e))
    const range = rangeObjets.length > 1 ? rangeObjets.join(", ") : rangeObjets[0];
    const position = characterData.data.position.map((e) => capitalizeFirstLetter(e)).join(", ")

    return { id: characterData._id, sprite, gender, tags, ressource, range, position }
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
    characterGuessId.value = id;
}

function handleSendCharacter() {
    socket.value?.emit("game:speedrundle:guess", roomId.value, currentUser.value._id, characterGuessId.value)
    characterGuessId.value = "";
}

socket.value?.on("game:speedrundle:data", ({ data }: { data: any }, target: string) => {
    stateData.value.gameData = data;

    if (target === "all" || target === currentUser.value._id) {
        userAnswers.value = gameData.value.usersAnswers?.find(({ playerId }) => playerId === currentUser.value._id)
    }

    if (charactersToGuess.value?.length === 0) {
        console.log("to Guess", data.charactersToGuess);

        charactersToGuess.value = data.charactersToGuess ?? [];
    }
    if (allCharacters.value?.length === 0) {
        console.log("all", data.allCharacters);

        allCharacters.value = data.allCharacters ?? [];
    }
})

watch(
    () => characterGuessId.value,
    (newVal) => {
        if (newVal)
            handleSendCharacter()
    },
)


</script>