import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

const loadUserInfo = async () => {
  const userInfo = await keycloak
    .loadUserInfo();
  return userInfo;
};

export { keycloak, loadUserInfo };