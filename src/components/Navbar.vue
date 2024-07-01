<template>
  <nav class="px-8 py-4 fixed left-0 right-0 top-0 z-30 bg-dark1 text-white text-sm">
    <div class="flex flex-wrap justify-between items-center 3xl:max-w-screen-3xl w-full mx-auto 3xl:px-4 h-10">
      <button class="flex items-center gap-4" @click="handleOpenLobby">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7 1V19M3 1H17C18.1046 1 19 1.89543 19 3V17C19 18.1046 18.1046 19 17 19H3C1.89543 19 1 18.1046 1 17V3C1 1.89543 1.89543 1 3 1Z"
            stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <div v-if="roomId" class="flex items-center gap-2 rounded-full px-3 py-2" :class="{
        'bg-white bg-opacity-20': data.gameState === 'lobby',
        'bg-primary text-primary glow': data.gameState !== 'lobby'
      }">
          <svg v-if="data.gameState === 'lobby'" width="22" height="16" viewBox="0 0 22 16" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13 15C13 13.4087 12.3679 11.8826 11.2426 10.7574C10.1174 9.63214 8.5913 9 7 9M7 9C5.4087 9 3.88258 9.63214 2.75736 10.7574C1.63214 11.8826 1 13.4087 1 15M7 9C9.20914 9 11 7.20914 11 5C11 2.79086 9.20914 1 7 1C4.79086 1 3 2.79086 3 5C3 7.20914 4.79086 9 7 9ZM21 15C21 13.4087 20.3679 11.8826 19.2426 10.7574C18.1174 9.63214 16.5913 9 15 9C16.0609 9 17.0783 8.57857 17.8284 7.82843C18.5786 7.07828 19 6.06087 19 5C19 3.93913 18.5786 2.92172 17.8284 2.17157C17.0783 1.42143 16.0609 1 15 1"
              stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="16" fill="white" viewBox="0 0 384 512">
            <path
              d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
          </svg>
          <span class="text-white">{{ data.users?.length }} players</span>
        </div>
        <span v-else class="font-semibold">
          JOUER
        </span>

      </button>
      <div class="flex items-center gap-2">
        <!-- Apps -->
        <router-link to="/">
          <Button :selected="currentPath === '/'">
            <svg width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 7.5H9M7 5.5V9.5M14 8.5H14.01M17 6.5H17.01M16.32 1.5H5.68C4.69028 1.50023 3.73579 1.86738 3.00103 2.53046C2.26628 3.19355 1.80345 4.10549 1.702 5.09C1.696 5.142 1.692 5.191 1.685 5.242C1.604 5.916 1 10.956 1 12.5C1 13.2956 1.31607 14.0587 1.87868 14.6213C2.44129 15.1839 3.20435 15.5 4 15.5C5 15.5 5.5 15 6 14.5L7.414 13.086C7.78899 12.7109 8.29761 12.5001 8.828 12.5H13.172C13.7024 12.5001 14.211 12.7109 14.586 13.086L16 14.5C16.5 15 17 15.5 18 15.5C18.7956 15.5 19.5587 15.1839 20.1213 14.6213C20.6839 14.0587 21 13.2956 21 12.5C21 10.955 20.396 5.916 20.315 5.242C20.308 5.192 20.304 5.142 20.298 5.091C20.1968 4.10631 19.7341 3.19413 18.9993 2.53083C18.2645 1.86754 17.3099 1.50026 16.32 1.5Z"
                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Hub
          </Button>
        </router-link>
        <router-link to="/community">
          <Button :selected="currentPath === '/community'">
            <svg width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 7.5H9M7 5.5V9.5M14 8.5H14.01M17 6.5H17.01M16.32 1.5H5.68C4.69028 1.50023 3.73579 1.86738 3.00103 2.53046C2.26628 3.19355 1.80345 4.10549 1.702 5.09C1.696 5.142 1.692 5.191 1.685 5.242C1.604 5.916 1 10.956 1 12.5C1 13.2956 1.31607 14.0587 1.87868 14.6213C2.44129 15.1839 3.20435 15.5 4 15.5C5 15.5 5.5 15 6 14.5L7.414 13.086C7.78899 12.7109 8.29761 12.5001 8.828 12.5H13.172C13.7024 12.5001 14.211 12.7109 14.586 13.086L16 14.5C16.5 15 17 15.5 18 15.5C18.7956 15.5 19.5587 15.1839 20.1213 14.6213C20.6839 14.0587 21 13.2956 21 12.5C21 10.955 20.396 5.916 20.315 5.242C20.308 5.192 20.304 5.142 20.298 5.091C20.1968 4.10631 19.7341 3.19413 18.9993 2.53083C18.2645 1.86754 17.3099 1.50026 16.32 1.5Z"
                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Community
          </Button>
        </router-link>
        <router-link to="/premium">
          <Button :selected="currentPath === '/premium'">
            <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 17.5H18M1 1.5L4 13.5H18L21 1.5L15 8.5L11 1.5L7 8.5L1 1.5Z" stroke="white" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Premium
          </Button>
        </router-link>

        <div v-if="currentUser" class="flex flex-row items-center">
          <button type="button"
            class="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300"
            id="user-menu-button" aria-expanded="false" data-dropdown-toggle="dropdown"
            @click="showUserMenu = !showUserMenu">
            <span class="sr-only">Open user menu</span>
            <img class="w-8 h-8 rounded-full" :src="currentUser?.picture" alt="user photo" />
          </button>
        </div>
        <Button v-else type="primary" shape="squared" @click="handleConnect">Se connecter</Button>
        <!-- Dropdown menu -->
        <div
          class="absolute right-0 top-10 z-30 my-4 mr-4 w-56 text-base list-none bg-white divide-y divide-gray-100 shadow rounded-xl"
          :class="{ hidden: !showUserMenu }" id="dropdown">
          <div class="py-3 px-4">
            <span class="block text-sm font-semibold text-gray-900">{{ currentUser?.firstname }} {{
        currentUser?.lastname }}</span>
            <span class="block text-sm text-gray-900 truncate">{{
        currentUser?.email
      }}</span>
          </div>
          <ul class="py-1 text-gray-700" aria-labelledby="dropdown">
            <li>
              <a href="#" class="flex items-center py-2 px-4 text-sm hover:bg-gray-100">
                <svg class="mr-2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clip-rule="evenodd"></path>
                </svg>
                My profile</a>
            </li>
            <li>
              <a href="#" class="flex items-center py-2 px-4 text-sm hover:bg-gray-100">
                <svg class="mr-2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z">
                  </path>
                </svg>
                Account settings</a>
            </li>
          </ul>
          <ul class="py-1 text-gray-700" aria-labelledby="dropdown">
            <li>
              <span class="block py-2 px-4 text-sm hover:bg-gray-100 cursor-pointer" @click="handleLogout">Sign
                out</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useAuthStore } from "../modules/auth/auth.store";
import { useSocketStore } from "../modules/socket/socket.store";
import Button from "../components/Button.vue";
import { useGamesStore } from "@/modules/games/games.store";
import router from "@/router";

const store = useAuthStore();
const roomStore = useSocketStore();
const gameStore = useGamesStore();
const roomId = computed(() => roomStore.getRoomId);
const data = computed(() => roomStore.getRoomData);
const currentPath = computed(() => router.currentRoute.value.fullPath);

const currentUser = computed(() => store.getCurrentUser);
const showUserMenu = ref(false);

function handleOpenLobby() {
  gameStore.setIsLobbyCollapsed(false);
}

async function handleConnect() {
  try {
    router.push("/login");
  } catch (err) {
    console.error(err);
  }
}

async function handleLogout() {
  try {
    await store.logout();
    router.push("/login");
  } catch (err) {
    console.error(err);
  }
}
</script>

<style scoped>
.glow {
  box-shadow: 0px 0px 10px 1px currentColor;
}
</style>