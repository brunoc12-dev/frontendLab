import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// importación de componentes y layouts
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import LoginView from "@/views/LoginView.vue";
import HomeView from '@/views/HomeView.vue';
import RegisterView from '@/views/RegisterView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ContabilidadView from '@/views/ContabilidadView.vue';
import ContabilidadDashboardView from '@/views/ContabilidadDashboardView.vue';

const routes = [
    {
        path:'/',
        component:DefaultLayout,
        children:[
            {
                path:'',
                name:'home',
                component: HomeView
            },
            {
                path: 'dashboard',
                name: 'dashboard',
                component: DashboardView,
                meta: { requiresAuth:true }
            },
            {
                path: 'tasks',
                name: 'tasks',
                component: DashboardView,
                meta: { requiresAuth:true }
            },
            {
                path: 'contabilidad',
                name: 'contabilidad',
                component: ContabilidadView,
                meta: { requiresAuth: true }
            },
            {
                path: 'contabilidad/dashboard',
                name: 'contabilidad-dashboard',
                component: ContabilidadDashboardView,
                meta: { requiresAuth: true }
            }
        ]
    },
    {
        path:'/',
        component: AuthLayout,
        children: [
            {
                path:'login',
                name:'login',
                component:LoginView,
                meta:{ guest: true }
            },
            {
                path:'register',
                name:'register',
                component:RegisterView,
                meta:{ guest: true }
            },
        ]
    },
    {
        path:'/:pathMatch(.*)*',
        name:'not-found',
        component: NotFoundView
    }
];

const router = createRouter({
    history:createWebHistory(import.meta.env.BASE_URL),
    routes
});


router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isGuestOnly = to.matched.some(record => record.meta.guest);

    if (requiresAuth && !authStore.isAuthenticated){
        next({name:'login'});
    }else if(isGuestOnly && authStore.isAuthenticated){
        next({name:'dashboard'});
    }else{
        next();
    }
})

export default router;