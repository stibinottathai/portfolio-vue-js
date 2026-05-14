import { createRouter, createWebHistory } from 'vue-router'

const PortfolioView = () => import('../components/PortfolioView.vue')
const AdminPanel = () => import('../components/AdminPanel.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: PortfolioView,
      meta: { title: 'Stibin Augustine — Flutter Developer Portfolio' }
    },
    {
      path: '/admin',
      component: AdminPanel,
      meta: { title: 'Admin Panel — Stibin Augustine' }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // Only scroll to anchor on the portfolio page, not /admin
    if (to.hash && to.path === '/') {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Stibin Augustine'
  next()
})

export default router
