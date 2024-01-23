<template>
  <nav class="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
    <div class="flex flex-wrap justify-between items-center 3xl:max-w-screen-3xl w-full mx-auto 3xl:px-4">
      <div class="flex justify-start items-center">
        <router-link to="/" class="flex items-center justify-between mr-4">
          <img
            src="https://flowbite.s3.amazonaws.com/logo.svg"
            class="mr-3 h-8"
            alt="Flowbite Logo"
          />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">GamerHub</span>
        </router-link>
      </div>
      <div class="flex items-center lg:order-2">  
        <!-- Apps -->
        <div v-if="authToken" class="flex flex-row items-center">
          <button
            type="button"
            data-dropdown-toggle="apps-dropdown"
            class="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <span class="sr-only">Games</span>
            <!-- Icon -->
            <svg
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              ></path>
            </svg>
          </button>          
          <button
            type="button"
            class="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="dropdown"
            @click="showUserMenu = !showUserMenu"
          >
            <span class="sr-only">Open user menu</span>
            <img
              class="w-8 h-8 rounded-full"
              :src="currentUser?.picture"
              alt="user photo"
            />
          </button>
        </div>
        <button v-else @click="handleConnect">Se connecter</button>
        <!-- Dropdown menu -->
        <div
          class="absolute right-0 top-10 z-50 my-4 mr-4 w-56 text-base list-none bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl"
          :class="{ 'hidden': !showUserMenu }"
          id="dropdown"
        >
          <div class="py-3 px-4">
            <span
              class="block text-sm font-semibold text-gray-900 dark:text-white"
              >{{ currentUser?.firstname }} {{ currentUser?.lastname }}</span
            >
            <span
              class="block text-sm text-gray-900 truncate dark:text-white"
              >{{ currentUser?.email }}</span
            >
          </div>
          <ul
            class="py-1 text-gray-700 dark:text-gray-300"
            aria-labelledby="dropdown"
          >
            <li>
              <a
                href="#"
                class="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                ><svg
                  class="mr-2 w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                My profile</a
              >
            </li>
            <li>
              <a
                href="#"
                class="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                ><svg
                  class="mr-2 w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
                  ></path>
                </svg>
                Account settings</a
              >
            </li>
          </ul>
          <ul
            class="py-1 text-gray-700 dark:text-gray-300"
            aria-labelledby="dropdown"
          >
            <li>
              <span
                class="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                @click="handleLogout"
                >Sign out</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import * as oauth from 'oauth4webapi';
import { computed, ref } from "vue";
import { useAuthStore } from "../modules/auth/auth.store";
import { logout } from '../services/keycloak';

const store = useAuthStore();

const authToken = computed(() => store.getAuthToken)
const currentUser = computed(() => store.getCurrentUser)
const showUserMenu = ref(false);

async function handleOIDCAuth() {
  const issuer = new URL(`${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}`);
  const as = await oauth.discoveryRequest(issuer).then((response) => oauth.processDiscoveryResponse(issuer, response));

  const client = {
    client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    redirect_uri: `${import.meta.env.VITE_APP_URL}/callback`,
  };

  if (as.code_challenge_methods_supported?.includes('S256') !== true) {
    throw new Error();
  }

  const codeVerifier = oauth.generateRandomCodeVerifier();
  localStorage.setItem('oidc_verifier', codeVerifier);
  const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);

  const authorizationUrl = new URL(as.authorization_endpoint);
  authorizationUrl.searchParams.set('client_id', client.client_id);
  authorizationUrl.searchParams.set('code_challenge', codeChallenge);
  authorizationUrl.searchParams.set('code_challenge_method', 'S256');
  authorizationUrl.searchParams.set('redirect_uri', client.redirect_uri);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', 'openid email profile');

  window.location.assign(authorizationUrl);
}

async function handleConnect() {
  try {
    await handleOIDCAuth();
  } catch(err) {
    console.error(err);
  }
}

async function handleLogout() {
  try {
    const access_token = localStorage.getItem('auth_token');
    const refresh_token = localStorage.getItem('refresh_auth_token');

    await logout(`${access_token}`, `${refresh_token}`);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_auth_token');
    store.setAuthToken(undefined);
    store.setCurrentUser(undefined)
  } catch(err) {
    console.log(err);
  }
  showUserMenu.value = false;
}
</script>