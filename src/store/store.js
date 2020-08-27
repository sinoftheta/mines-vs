import Vue from 'vue';
import Vuex from 'vuex';

//import {jwtModel} from ''; 
let jwtModel = {};

Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        jwt: jwtModel,
        group: {
            id: 0,
            name: '',
            members: [{
                id: 0,
                name: ''
            }]
        },
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
    }
});

export default store;