import axios from "axios";

function getOIDCApi(token: string) {
  return axios.create({
    baseURL: `${import.meta.env.VITE_KEYCLOAK_URL}/realms/gamerhub/protocol/openid-connect`,
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  });
}

export async function getUser(token: string): Promise<any> {
  try {
    const { data } = await getOIDCApi(token).get('/userinfo');

    return data;
  } catch(err) {
    return undefined;
  }
}

export async function logout(token: string, refreshToken: string): Promise<void> {
  try {
    await getOIDCApi(token).post('/logout', { 
      client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
      refresh_token: refreshToken,
    });
  } catch(err) {
    console.log(err);
  }
}
