import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index';
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import './style.css'
import App from './App.vue'

const store = createPinia();
const app = createApp(App);

app
  .use(router)
  .use(store)
  .use(Vue3Toastify, {clearOnUrlChange: false})
  .mount('#app');
