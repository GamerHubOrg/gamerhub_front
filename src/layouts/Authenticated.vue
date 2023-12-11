<template>
  <div>ok</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Keycloak from "keycloak-js";

const options = {
  url: 'https://gamerhubauth.duckdns.org:8443/',
  realm: 'gamerhub',
  clientId: 'gamerhub_client'
}

const keycloak = ref(new Keycloak(options));
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  authenticated.value = await keycloak.value.init({ onLoad: "check-sso", checkLoginIframe: false });
  loading.value = false
})
</script>