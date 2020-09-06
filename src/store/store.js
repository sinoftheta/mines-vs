import Vue from 'vue';
import Vuex from 'vuex';

const difficulty =  {
    beginner: {
        height: 10,
        width:  10,
        mines:  10,
    },
    intermediate: {
        height: 16,
        width:  16,
        mines:  40
    },
    expert: {
        height: 16,
        width:  30,
        mines:  99
    },
    honkenhuge: {
        height: 22,
        width: 38,
        mines: 175
    }
}
Vue.use(Vuex);

const store = new Vuex.Store({
    state: () => ({
        userId: 0,
        peerId: 1,
        seed: 69,
        board: difficulty.expert,
        mode: 'beginner' // beginner | intermediate | expert | custom 
    }),
    actions: {
        init({_state, commit}){
            // get jwt from url params
            //commit('setJwt', jwt)
            /*
            fetch('https://api.oregonstate.education/reflect/v1/group')
            .then(res => res.json())
            .then(data => commit('setGroup', data.message));
            */
        }
    },
    mutations: {
        /* Vue.set(object, key, value) */
        //setGroup(state, group){Vue.set(state, 'group', group);}
        userId(state, id){Vue.set(state, 'userId', id)},
        peerId(state, id){Vue.set(state, 'peerId', id)}
    }
});

export default store;