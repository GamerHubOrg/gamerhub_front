<template>
  <div>
    <span>home</span>
    <button v-if="!authToken" @click="handleConnect">connecter</button>
    <router-link v-else to="/games">access games</router-link>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useAuthStore } from "../modules/auth/auth.store";
import { keycloak } from '../services/keycloak'

const store = useAuthStore();

const authToken = computed(() => store.getAuthToken)

async function handleConnect() {
  try {
    await keycloak.login();
  } catch(err) {
    console.error(err);
  }
}
</script>