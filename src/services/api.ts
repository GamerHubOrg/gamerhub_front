import a from "axios";
import { keycloak } from "./keycloak";

const axios = a.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

axios.interceptors.request.use((config: any) => {
  const request = {
    ...config,
    method: config.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': keycloak.token,
    }
  };

  return request
})

export default axios;