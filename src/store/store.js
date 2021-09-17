import Vue from 'vue';
import Vuex from 'vuex';

const difficulty =  {
    bullet:{
        height: 8,
        width: 8,
        mines: 8,
    },
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
        ...difficulty.expert,
        mode: 'expert', // beginner | intermediate | expert | custom 
        autoPlay: true,
    }),
    actions: { 
        init({_state, commit}){ // eslint-disable-line
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
        peerId(state, id){Vue.set(state, 'peerId', id)},
        autoPlay(state, val){Vue.set(state, 'autoPlay', val)},
        height(state, h ){Vue.set(state, 'height', h ); Vue.set(state, 'mode', 'custom' );},
        width (state, w ){Vue.set(state, 'width' , w ); Vue.set(state, 'mode', 'custom' );},
        mines (state, m) {Vue.set(state, 'mines' , m ); Vue.set(state, 'mode', 'custom' );},
        mode  (state, mode){
            if(!difficulty[mode]) return;
            Vue.set(state, 'mode'  , mode );
            Vue.set(state, 'height', difficulty[mode].height ); 
            Vue.set(state, 'width' , difficulty[mode].width  );
            Vue.set(state, 'mines' , difficulty[mode].mines  );
        },
    }
});

export default store;