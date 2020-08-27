import Vue from 'vue';
import Router from 'vue-router';

import Intro from '@/components/Intro';
import Survey from '@/components/Survey';
import Results from '@/components/Results';


Vue.use(Router);

//vue routes: intro | survey | results | unauthorized, ...use navigation guard hooks
const router = new Router({
    routes: [
        {
            path: '/',
            redirect : '/start'
        },
        {
            path: '/start',
            name: 'Intro',
            component: Intro
        },
        {
            path: '/survey',
            name: 'Survey',
            component: Survey
        },
        {
            path: '/results',
            name: 'Results',
            component: Results
        }
    ]
});

export default router;