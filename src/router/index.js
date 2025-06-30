import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '',
    redirect: '/home',
    component: () => import('../views/index.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/home.vue')
      },
    ]
  },
  {
    path: '/admin',
    redirect: '/admin/home',
    component: () => import('../views/admin/index.vue'),
    children: [
      {
        path: 'home',
        name: 'adminHome',
        component: () => import('../views/admin/home.vue')
      },
      {
        path: 'user/list',
        name: 'adminUserList',
        component: () => import('../views/admin/user/list.vue')
      },
      {
        path: 'bucket/list',
        name: 'adminBucketList',
        component: () => import('../views/admin/bucket/list.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
