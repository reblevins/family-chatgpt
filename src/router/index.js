import { createRouter, createWebHistory } from 'vue-router'
import CurrentChat from '@/components/CurrentChat.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CurrentChat
    },
  ]
})

export default router
