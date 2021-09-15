import Vue      from 'vue';
import Router   from 'vue-router';

import Vs       from '@/views/Vs';
import Settings from '@/views/Settings';
import Single   from '@/views/Single';

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
        /*
        {
            path: '/race',
            name: 'Race',
            component: Race
        },
        {
            path: '/anti',
            name: 'AntiMine',
            component: AntiMine
        },
        */
        {
            path: '/solo',
            name: 'Single',
            component: Single
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
        /*
        {
            path: '/learn',
            name: 'Tutorial',
            component: Tutorial
        }
         */
    ]
});

export default router;