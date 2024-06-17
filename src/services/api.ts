import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

instance.interceptors.request.use((config: any) => {
  const request = {
    ...config,
    method: config.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('gamerhub_token'),
    }
  };

  return request
})

export default instance;