import Vue from 'vue';
import Router from 'vue-router';

import Vs from '@/components/Vs';
import Settings from '@/components/Settings';


Vue.use(Router);

//...use navigation guard hooks?
const router = new Router({
    routes: [
        {
            path: '/',
            redirect : '/vs'
        },
        {
            path: '/vs',
            name: 'Vs',
            component: Vs
        },
        {
            path: '/settings',
            name: 'Settings',
            component: Settings
        }
        /*
        {
            path: '/about',
            name: 'About',
            component: About
        }
         */
    ]
});

export default router;