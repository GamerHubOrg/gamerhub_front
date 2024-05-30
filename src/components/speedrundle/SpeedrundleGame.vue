<template>
   <div class="flex flex-col items-center gap-7">
        <h2 class="text-3xl">Speedrun Dle</h2>
        <p>Le thème de la partie est : <span class="font-semibold">{{ roomCong?.theme }} : {{  roomCong?.mode }}</span></p>
        <div class="absolute right-0 flex flex-col gap-1">
            <div 
                v-for="user in roomData.users" 
                :key="user.socket_id"
                class="flex justify-center items-center"
            >
                <div 
                    class="flex items-center gap-2 max-w-48 max-h-12 p-3 rounded-md"
                    :class="currentUser?.email === user.email ? 'bg-lightgrey' : 'bg-darkgrey'">
                >
                    <div class="max-h-12 max-w-12 text-xs truncate ">
                        <img :src="user.picture" class="W-full rounded-md">
                        <span class="text-xs truncate">{{ user.username }} </span>
                    </div>
                    <span class="font-semibold text-xs">Score : {{ getUserScore(user.id) }}</span>
                </div>
            </div>
        </div>

        <Combobox as="div" v-model="characterForm" @update:modelValue="query = ''">
            <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">Assigned to</ComboboxLabel>
            <div class="relative mt-2">
            <ComboboxInput class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" @change="query = $event.target.value" @blur="query = ''" :display-value="(person) => person?.name" />
            <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </ComboboxButton>

            <ComboboxOptions v-if="filteredPeople.length > 0" class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ComboboxOption v-for="person in filteredPeople" :key="person.id" :value="person" as="template" v-slot="{ active, selected }">
                <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-gray-900']">
                    <div class="flex items-center">
                    <img :src="person.imageUrl" alt="" class="h-6 w-6 flex-shrink-0 rounded-full" />
                    <span :class="['ml-3 truncate', selected && 'font-semibold']">
                        {{ person.name }}
                    </span>
                    </div>

                    <span v-if="selected" :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-indigo-600']">
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                </li>
                </ComboboxOption>
            </ComboboxOptions>
            </div>
        </Combobox>



        <!-- <div class="border flex flex-row items-center gap-3 bg-dark2 border-gray-200 p-3 rounded-md">
            <input v-model="characterForm" type="text" class="p-3 bg-dark2">
            <button class="bg-green-400 rounded p-3" @click="handleSendCharacter">Send</button>
        </div> -->

        <div class="w-3/4">
            <table class="border-collapse bg-dark2 w-full">
                <tr>
                    <th v-for="column in gameData?.columns">
                        {{ column.name }}
                    </th>
                </tr>
            </table>
        </div>
   </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/auth.store';
import { User } from '@/modules/auth/user';
import { useSocketStore } from '../../modules/socket/socket.store';
import { computed, Ref, ref, watch } from 'vue';
import { ILolCharacter, ISpeedrundleGameData, ISpeedrundleRoomData, ISpeedrundleScore } from './speedrundle.types';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'

const store = useAuthStore();
const socketStore = useSocketStore();

const stateData = computed(() => socketStore.getRoomData)
const roomId = computed(() => socketStore.getRoomId)
const socket = computed(() => socketStore.getSocket)

const characterForm : Ref<string | undefined>= ref(undefined);
const currentUser = computed(() => (store.getCurrentUser as User))
const roomData = computed(() => (stateData.value as ISpeedrundleRoomData));
const roomCong = computed(() => roomData.value.config);
const gameData = computed(() => roomData.value.gameData as ISpeedrundleGameData);

const charactersToGuess: Ref<ILolCharacter[]> = ref(gameData.value.charactersToGuess);
const charactersRemaining: Ref<ILolCharacter[]> = ref(gameData.value.allCharacters);
function getUserScore(userId: string): number {
    const scoreEntry = gameData?.value?.score?.find((score: ISpeedrundleScore) => score.playerId === userId);
    return scoreEntry ? scoreEntry.points : 0;
}

const people = [
  {
    id: 1,
    name: 'Lux',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 2,
    name: 'Katarina',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 3,
    name: 'Syndra',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 4,
    name: 'Ahri',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  // More users...
]

const query = ref('')
const filteredPeople = computed(() =>
  query.value === ''
    ? people
    : people.filter((person) => {
        return person.name.toLowerCase().includes(query.value.toLowerCase())
      })
)

function handleSendCharacter() {
    console.log('éééééééééé', characterForm.value)
    if (!characterForm.value || characterForm.value.trim() === '') return;
    //socket.value?.emit("game:speedrundle:send-character", { roomId: roomId.value, userId: currentUser, character: characterForm.value});
    //TODO : A décaler dans le socket back
    let currentUserScore = getUserScore(currentUser.value.id) || 0
    const index = roomCong?.value?.nbRounds ? roomCong?.value?.nbRounds - 1 : 0
    console.log(currentUserScore, charactersToGuess.value[index].name)
    if (charactersToGuess.value[index].name === characterForm.value) {
        currentUserScore += 100;
        console.log("Bravo, vous avez trouvé le bon personnage ! ", characterForm.value)
    } else {
        console.log("Dommage, vous avez trouvé le mauvais personnage ! ", characterForm.value )
    }
    characterForm.value = undefined;
}

socket.value?.on("game:speedrundle:data", ({ data }: { data: any }) => {
    stateData.value.gameData = data;
    charactersToGuess.value = data.charactersToGuess;
    charactersRemaining.value = data.allCharacters;
    console.log('data', data)
})

watch(
    () => characterForm.value,
    (newVal) => {
      if (newVal)
      handleSendCharacter()
    },
    {deep: true}
)


</script>