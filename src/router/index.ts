import {createRouter, createWebHistory} from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'default',
    children: [
      {
        path: '',
        name: 'authenticated_layout',
        component: () => import('../layouts/Authenticated.vue'),
        children: [
          {
            path: '',
            name: 'home',
            component: () => import('../views/Home.vue'),
          },
          {
            path: '/premium',
            name: 'premium',
            component: () => import('../views/Premium.vue'),
          },
          {
            path: '/room/:roomId',
            name: 'game start',
            meta: { requireAuth: true },
            component: () => import('../views/Game.vue'),
          },
          {
            path: '/community',
            name: 'community',
            meta: { requireAuth: true },
            component: () => import('../views/Community.vue'),
          },
          {
            path: '/profile',
            name: 'profile',
            meta: { requireAuth: true },
            component: () => import('../views/Profile.vue'),
          },
        ]
      },
      {
        path: '/admin',
        name: 'admin_layout',
        component: () => import('../layouts/Admin.vue'),
        children: [
          {
            path: '',
            name: 'admin',
            component: () => import('../views/admin/Admin.vue'),
          },
          {
            path: 'users',
            name: 'admin_users',
            component: () => import('../views/admin/Users.vue'),
          },
          {
            path: 'games',
            name: 'admin_games',
            component: () => import('../views/admin/Games.vue'),
          }
        ]
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/Register.vue'),
  },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes,
});

export default router;
