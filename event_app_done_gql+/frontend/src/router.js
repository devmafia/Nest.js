import { createRouter, createWebHistory } from 'vue-router';
import Events from './views/Events.vue';
import Cart from './views/Cart.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Profile from './views/Profile.vue';
import AdminPanel from './views/AdminPanel.vue';
import LoginAdmin from './views/LoginAdmin.vue';
import EventDetails from './views/EventDetails.vue';

const routes = [
    {
        path: '/',
        name: 'Events',
        component: Events,
    },
    {
        path: '/event/:id',
        name: 'EventDetails',
        component: EventDetails,
    },
    {
        path: '/cart',
        name: 'Cart',
        component: Cart,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true }
    },
    {
        path: '/panel',
        name: 'Admin',
        component: AdminPanel,
        meta: { requiresAdmin: true}
    },
    {
        path: '/admin',
        name: 'LoginAdmin',
        component: LoginAdmin,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('jwt');
    const isAdminAuthenticated = !!localStorage.getItem('jwtAdmin');

    if (to.meta.requiresAdmin && !isAdminAuthenticated) {
        return next('/admin');
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
        return next('/login');
    }

    next();
});

export default router;
