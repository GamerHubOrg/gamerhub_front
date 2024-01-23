import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'autenticated_layout',
    meta: { requireAuth: false },
    component: () => import('../layouts/Authenticated.vue'),
    children: [
      {
        path: '',
        name: 'home',
        meta: { requireAuth: false },
        component: () => import('../views/Home.vue'),
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

export default router;
