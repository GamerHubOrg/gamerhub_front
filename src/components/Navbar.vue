<template>
  <Disclosure as="nav" class="px-4 xl:px-8 pt-4 fixed left-0 right-0 top-0 z-30 bg-dark1 text-white text-sm"
    v-slot="{ open }">
    <!-- Desktop vue -->
    <div class="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <button class="flex items-center gap-4 duration-200 hover:brightness-[85%]" @click="handleOpenLobby">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 1V19M3 1H17C18.1046 1 19 1.89543 19 3V17C19 18.1046 18.1046 19 17 19H3C1.89543 19 1 18.1046 1 17V3C1 1.89543 1.89543 1 3 1Z"
              stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <div v-if="roomId" class="flex items-center gap-2 rounded-full px-3 py-2" :class="{
            'bg-white bg-opacity-20': data.gameState === 'lobby',
            'bg-primary text-primary glow': data.gameState !== 'lobby',
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
            <span class="text-white">{{ data.users?.length }} {{ $t("home.game-list-item.players", data.users?.length || 0) }}</span>
          </div>
          <span v-else class="font-semibold">{{ $t("navbar.play") }}</span>
        </button>
        <div class="flex">
          <div class="flex items-center">
            <div class="hidden md:ml-6 md:block">
              <div class="flex space-x-4">
                <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
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
                    {{ $t("navbar.navLinks.community") }}
                  </Button>
                </router-link>
                <router-link to="/premium">
                  <Button :selected="currentPath === '/premium'">
                    <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 17.5H18M1 1.5L4 13.5H18L21 1.5L15 8.5L11 1.5L7 8.5L1 1.5Z" stroke="white"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    Premium
                  </Button>
                </router-link>
                <LocaleSwitcher />
                <router-link v-if="isCurrentUserAdmin" to="/admin" class="bg-primary w-7 flex justify-center items-center rounded-lg">
                  <RocketLaunchIcon class="w-4" />
                </router-link>
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="flex items-center">
              <!-- Profile dropdown -->
              <Menu as="div" class="relative ml-3">
                <div>
                  <MenuButton
                    class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span class="absolute -inset-1.5" />
                    <span class="sr-only">{{ $t("navbar.openProfile") }}</span>
                    <div v-if="currentUser" class="flex flex-row items-center">
                      <button type="button"
                        class="flex text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300"
                        id="user-menu-button" aria-expanded="false" data-dropdown-toggle="dropdown"
                        @click="showUserMenu = !showUserMenu">
                        <span class="sr-only">{{
                          $t("navbar.openProfile")
                        }}</span>
                        <img class="w-8 h-8 rounded-full" :src="currentUser?.picture" alt="user photo" />
                      </button>
                    </div>
                    <Button v-else color="primary" shape="squared" @click="handleConnect">{{ $t("navbar.login")
                      }}</Button>
                  </MenuButton>
                </div>
                <transition v-if="currentUser" enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95">
                  <MenuItems
                    class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-dark2 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <MenuItem v-slot="{ active }">
                    <router-link to="/profile" :class="[active ? 'ring-gray-400' : '']"
                      class="flex items-center py-2 px-4 text-sm hover:ring-gray-400">
                      <svg class="mr-2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clip-rule="evenodd"></path>
                      </svg>
                      {{ $t("navbar.myProfile") }}</router-link>
                    </MenuItem>
                    <MenuItem>
                    <span class="block py-2 px-4 text-sm hover:ring-gray-400 cursor-pointer" @click="handleLogout">{{
                      $t("navbar.signOut") }}</span>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
        </div>
        <!-- Mobile menu button -->
        <div class="-mr-2 flex md:hidden">
          <LocaleSwitcher />
          <div v-if="currentUser" class="relative inline-flex items-center justify-center rounded-md p-2">
            <img class="w-8 h-8 rounded-full" :src="currentUser?.picture" alt="user photo" />
          </div>
          <DisclosureButton
            class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="absolute -inset-0.5" />
            <span class="sr-only">{{ $t("navbar.openMenu") }}</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>
    <!-- Mobile vue -->
    <DisclosurePanel class="md:hidden space-y-5 pb-3 pt-2 flex flex-col">
      <div>
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
        <DisclosureButton as="a" href="/"
          class="flex items-center py-2 hover:ring-gray-400 text-base font-medium text-white">
          <Button :selected="currentPath === '/'">
            <svg width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 7.5H9M7 5.5V9.5M14 8.5H14.01M17 6.5H17.01M16.32 1.5H5.68C4.69028 1.50023 3.73579 1.86738 3.00103 2.53046C2.26628 3.19355 1.80345 4.10549 1.702 5.09C1.696 5.142 1.692 5.191 1.685 5.242C1.604 5.916 1 10.956 1 12.5C1 13.2956 1.31607 14.0587 1.87868 14.6213C2.44129 15.1839 3.20435 15.5 4 15.5C5 15.5 5.5 15 6 14.5L7.414 13.086C7.78899 12.7109 8.29761 12.5001 8.828 12.5H13.172C13.7024 12.5001 14.211 12.7109 14.586 13.086L16 14.5C16.5 15 17 15.5 18 15.5C18.7956 15.5 19.5587 15.1839 20.1213 14.6213C20.6839 14.0587 21 13.2956 21 12.5C21 10.955 20.396 5.916 20.315 5.242C20.308 5.192 20.304 5.142 20.298 5.091C20.1968 4.10631 19.7341 3.19413 18.9993 2.53083C18.2645 1.86754 17.3099 1.50026 16.32 1.5Z"
                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Hub
          </Button>
        </DisclosureButton>
        <DisclosureButton as="a" href="/community"
          class="block rounded-md py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
          <Button :selected="currentPath === '/community'">
            <svg width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 7.5H9M7 5.5V9.5M14 8.5H14.01M17 6.5H17.01M16.32 1.5H5.68C4.69028 1.50023 3.73579 1.86738 3.00103 2.53046C2.26628 3.19355 1.80345 4.10549 1.702 5.09C1.696 5.142 1.692 5.191 1.685 5.242C1.604 5.916 1 10.956 1 12.5C1 13.2956 1.31607 14.0587 1.87868 14.6213C2.44129 15.1839 3.20435 15.5 4 15.5C5 15.5 5.5 15 6 14.5L7.414 13.086C7.78899 12.7109 8.29761 12.5001 8.828 12.5H13.172C13.7024 12.5001 14.211 12.7109 14.586 13.086L16 14.5C16.5 15 17 15.5 18 15.5C18.7956 15.5 19.5587 15.1839 20.1213 14.6213C20.6839 14.0587 21 13.2956 21 12.5C21 10.955 20.396 5.916 20.315 5.242C20.308 5.192 20.304 5.142 20.298 5.091C20.1968 4.10631 19.7341 3.19413 18.9993 2.53083C18.2645 1.86754 17.3099 1.50026 16.32 1.5Z"
                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ $t("navbar.navLinks.community") }}
          </Button>
        </DisclosureButton>
        <DisclosureButton as="a" href="/premium"
          class="block rounded-md py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
          <Button :selected="currentPath === '/premium'">
            <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 17.5H18M1 1.5L4 13.5H18L21 1.5L15 8.5L11 1.5L7 8.5L1 1.5Z" stroke="white" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Premium
          </Button>
        </DisclosureButton>
      </div>
      <div v-if="currentUser" class="flex flex-col">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <button type="button" class="flex text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300"
              id="user-menu-button" aria-expanded="false" data-dropdown-toggle="dropdown"
              @click="showUserMenu = !showUserMenu">
              <span class="sr-only">{{ $t("navbar.openProfile") }}</span>
            </button>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <DisclosureButton as="a" href="/profile"
            class="flex items-center py-2 px-4 hover:ring-gray-400 text-base font-medium text-white">
            <svg class="mr-2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clip-rule="evenodd"></path>
            </svg>
            {{ $t("navbar.myProfile") }}
          </DisclosureButton>
          <span class="flex items-center py-2 px-4 hover:ring-gray-400 text-base font-medium text-white cursor-pointer"
            @click="handleLogout">{{ $t("navbar.signOut") }}</span>
        </div>
      </div>
      <Button v-else color="primary" shape="squared" @click="handleConnect">{{
        $t("navbar.login")
      }}</Button>
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useAuthStore } from "../modules/auth/auth.store";
import { useSocketStore } from "../modules/socket/socket.store";
import Button from "../components/Button.vue";
import { useGamesStore } from "@/modules/games/games.store";
import router from "@/router";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon, RocketLaunchIcon } from '@heroicons/vue/24/outline'
import LocaleSwitcher from "@/components/LocaleSwitcher.vue";

const store = useAuthStore();
const roomStore = useSocketStore();
const gameStore = useGamesStore();
const roomId = computed(() => roomStore.getRoomId);
const data = computed(() => roomStore.getRoomData);
const currentPath = computed(() => router.currentRoute.value.fullPath);

const currentUser = computed(() => store.getCurrentUser);
const isCurrentUserAdmin = computed(() => currentUser.value?.roles?.includes('admin'));
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
