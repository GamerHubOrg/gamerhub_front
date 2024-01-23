<template>
    <div>ok</div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as oauth from 'oauth4webapi';
import { useAuthStore } from '../modules/auth/auth.store';
import { getUser } from '../services/keycloak'

const route = useRoute();
const store = useAuthStore();
const router = useRouter();

async function verifyOIDCAuth() {
  const issuer = new URL(`${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}`);
  const redirectUri = `${import.meta.env.VITE_APP_URL}/callback`;

  const as = await oauth.discoveryRequest(issuer).then((response) => oauth.processDiscoveryResponse(issuer, response));

  const client = {
    client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    token_endpoint_auth_method: 'none',
  };

  const path = new URL(`${import.meta.env.VITE_APP_URL}${route.fullPath}`);
  const params = oauth.validateAuthResponse(as, client, path, oauth.expectNoState);
  if (oauth.isOAuth2Error(params)) {
    router.replace('/');
  }

  const codeVerifier = localStorage.getItem('oidc_verifier');
  if (!codeVerifier) {
    router.replace('/');
  }

  const response = await oauth.authorizationCodeGrantRequest(as, client, params, redirectUri, codeVerifier);
  const result = await oauth.processAuthorizationCodeOpenIDResponse(as, client, response);

  if (oauth.isOAuth2Error(result)) {
    router.replace('/');
  }

  if (result.access_token) {
    const access_token = `${result.access_token}`;
    const userInfo = await getUser(access_token);
    console.log(userInfo)
    localStorage.setItem('auth_token', access_token);
    localStorage.setItem('refresh_auth_token', `${result.refresh_token}`);
    store.setAuthToken(access_token);
    store.setCurrentUser({
      firstname: userInfo.given_name,
      lastname: userInfo.family_name,
      username: userInfo.preferred_username,
      email: userInfo.email,
      roles: userInfo.realm_access.roles
    })
  }

  localStorage.removeItem('oidc_verifier');
  router.replace('/');
}

onMounted(async () => {
  try {
    await verifyOIDCAuth();
  } catch (err) {
    router.replace('/');
  }
});
</script>