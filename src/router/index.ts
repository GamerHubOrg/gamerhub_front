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
      {
        path: '/room/:roomId',
        name: 'game start',
        meta: { requireAuth: false },
        component: () => import('../views/Game.vue'),
      },
      {
        path: '/community',
        name: 'community',
        meta: { requireAuth: false },
        component: () => import('../views/Community.vue'),
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

export default router;
