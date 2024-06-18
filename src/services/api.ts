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
    }
  };

  return request
})

instance.interceptors.response.use({}, (error) => {
  const originalRequest= error.config;
  if(error.response.status === 403){
    return instance.get('/users/refresh',{ withCredentials: true }).then((res)=>{
      if(res.status === 201){
        return axios(originalRequest)
      }
    })
  }
  return Promise.reject(error)
})

export default instance;