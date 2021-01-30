import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/home.vue')
  },
  {
    path: '/test',
    component: () => import('../views/test.vue')
  },
  {
    path: '/asyncapi',
    component: () => import('../views/asyncapi.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
