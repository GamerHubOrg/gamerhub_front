import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

instance.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('auth_token');
  const request = {
    ...config,
    method: config.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    }
  };

  return request
})

export default instance;