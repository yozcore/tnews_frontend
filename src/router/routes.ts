import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'news',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/follow',
        name: 'follow',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/meme',
        name: 'meme',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/event',
        name: 'event',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/question',
        name: 'question',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/today_i_learned',
        name: 'today_i_learned',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/off_topic',
        name: 'off_topic',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/product',
        name: 'product',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'post/',
        name: 'post',
        component: () => import('pages/ThreadPost.vue'),
        meta: { isPublic: true },
      },
      {
        path: '/:id?',
        name: 'user',
        component: () => import('pages/IndexPage.vue'),
        meta: { isPublic: true },
      },
    ],
  },
  {
    path: '/thread/:id?',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'detail',
        component: () => import('pages/ThreadDetail.vue'),
        meta: { isPublic: true },
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: 'login', component: () => import('pages/Login.vue') }],
    meta: {
      isPublic: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
