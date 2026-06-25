import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import ExamplePage from '../views/ExamplePage.vue'

const entities = ['users', 'roles', 'products', 'purchases', 'suppliers', 'clients', 'sales']

const entityRoutes: RouteRecordRaw[] = entities.flatMap(entity => [
  {
    path: `/${entity}`,
    name: `${entity}-list`,
    component: () => import(`../views/${entity}/index.vue`)
  },
  {
    path: `/${entity}/create`,
    name: `${entity}-create`,
    component: () => import(`../views/${entity}/create.vue`)
  },
  {
    path: `/${entity}/:id`,
    name: `${entity}-show`,
    component: () => import(`../views/${entity}/show.vue`)
  },
  {
    path: `/${entity}/:id/edit`,
    name: `${entity}-edit`,
    component: () => import(`../views/${entity}/edit.vue`)
  }
])

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ExamplePage
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { layout: 'empty' }
    },
    ...entityRoutes
  ],
})

// Guarda de Rotas Global para verificar autenticação
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('auth_token')
  
  // Se está indo para a tela de login e já está autenticado, manda pra home
  if (to.name === 'login' && isAuthenticated) {
    next({ name: 'home' })
  } 
  // Se a rota não for de login e o usuário não estiver autenticado, manda pro login
  else if (to.name !== 'login' && !isAuthenticated) {
    next({ name: 'login' })
  } 
  // Caso contrário, permite a navegação normal
  else {
    next()
  }
})

export default router
