import { createWebHistory, createRouter } from "vue-router";

const history = createWebHistory();

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./pages/Home.vue') , 
    meta: { breadcrumb: [ { name: 'home' } ] }
  },
  {
    path: '/cervix',
    name: 'cervix',
    component: () => import('./pages/Cervix.vue') , 
    meta: { breadcrumb: [ { name: 'home' } ] }
  },
  // aliases
  { path: "/:catchAll(.*)", redirect: '/404' }
] ; 

const Router = createRouter({ history, routes });

export default Router ; 