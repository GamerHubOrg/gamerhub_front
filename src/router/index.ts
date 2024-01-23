import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'autenticated_layout',
    component: () => import('../layouts/Authenticated.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/Home.vue'),
      },
    ]
  },
  {
    path: '/callback',
    name: 'callback',
    component: () => import('../views/Callback.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

export default router;
