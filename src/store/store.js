import Vue from 'vue';
import Vuex from 'vuex';

//import {jwtModel} from ''; 
let jwtModel = {};
let groupModel = {
    id: 0,
    name: '',
    members: [{
        id: 0,
        name: ''
    }]
};

Vue.use(Vuex);

const store = new Vuex.Store({
    state: () => ({
        jwt: jwtModel,
        group: groupModel,
        assignments: [{
            name: '',
            completed: false,
            reviews: [{
                reviewer_id: 0,
                reviewee_id: 0,
                score: 0,
                comment: ''
            }]
        }]
    }),
    actions: {
        init({_state, commit}){
            fetch('https://api.oregonstate.education/reflect/v1/group')
            .then(res => res.json())
            .then(data => commit('setGroup', data.message));
        }
    },
    mutations: {
        /* Vue.set(object, key, value) */
        setGroup(state, group){Vue.set(state, 'group', group);}
    }
});

export default store;