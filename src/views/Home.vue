<template>
  <div v-if="!loading">
    <button v-if="!authenticated" @click="handleLogin">se connecter</button>
    <div v-else>
      <p>{{ userInfo }}</p>
      <button @click="handleLogout">logout</button>
    </div>
  </div>
  <span v-else>loading...</span>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import Keycloak from 'keycloak-js'

const options = {
  url: 'https://gamerhubauth.duckdns.org:8443/',
  realm: 'gamerhub',
  clientId: 'gamerhub_client'
}

const keycloak = ref(new Keycloak(options));
const authenticated = ref(false);
const loading = ref(false);
const userInfo = computed(() => keycloak.value.idTokenParsed);

async function handleLogin() {
  try {
    await keycloak.value.login();
  } catch (error) {
      console.error('Failed to login:', error);
  }
}

async function handleLogout() {
  try {
    await keycloak.value.logout();
  } catch (error) {
      console.error('Failed to logout:', error);
  }
}

onMounted(async () => {
  loading.value = true;
  authenticated.value = await keycloak.value.init({ onLoad: "check-sso", checkLoginIframe: false });
  loading.value = false
})
</script>