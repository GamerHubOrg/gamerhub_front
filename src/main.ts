import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index';
import './style.css'
import App from './App.vue'
import { keycloak } from './services/keycloak';

const store = createPinia();
const app = createApp(App);

app
  .use(router)
  .use(store)

keycloak
  .init({ onLoad: 'check-sso', checkLoginIframe: false })
  .catch((err) => {
    if (err.error === 'login_required') {
      window.location.reload();
    }
  })
  .finally(() => {
    app.mount('#app');
  });