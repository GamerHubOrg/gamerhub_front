import { createRouter, createWebHistory } from 'vue-router';
import { keycloak } from '../services/keycloak';

const routes = [
  {
    path: '/',
    name: 'unautenticated_layout',
    meta: { requireAuth: false },
    component: () => import('../layouts/UnAuthenticated.vue'),
    children: [
      {
        path: '',
        name: 'home',
        meta: { requireAuth: false },
        component: () => import('../views/Home.vue'),
      },
    ]
  },
  {
    path: '/',
    name: 'autenticated_layout',
    meta: { requireAuth: true },
    component: () => import('../layouts/Authenticated.vue'),
    children: [
      {
        path: 'games',
        name: 'games',
        meta: { requireAuth: true },
        component: () => import('../views/Games.vue'),
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

export default router;
