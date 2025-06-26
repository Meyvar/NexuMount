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
