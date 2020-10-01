<template>
    <div>
        <textarea v-model="mines"  id="mines" cols="4" rows="1"></textarea>
        <label for="mines">mines</label>
        <br>
        <textarea v-model="height" id="height" cols="4" rows="1"></textarea>
        <label for="height">height</label>
        <br>
        <textarea v-model="width"  id="width" cols="4" rows="1"></textarea>
        <label for="width">width</label>
        <br>
        <input type="checkbox" id="beginner" v-model="beginner">
        <label for="beginner">beginner</label>

        <input type="checkbox" id="intermediate" v-model="intermediate">
        <label for="intermediate">intermediate</label>
        
        <input type="checkbox" id="expert" v-model="expert">
        <label for="expert">expert</label>
        
    </div>
</template>

<script>
import Nav from '@/components/Nav';

export default {
    name: 'Settings',
    components:{Nav},
    computed: {
        mines:{
            get(){return this.$store.state.mines;},
            set(v){this.$store.commit('mines', v)},
        },
        height:{
            get(){return this.$store.state.height;},
            set(v){this.$store.commit('height', v)},
        },
        width:{
            get(){return this.$store.state.width;},
            set(v){this.$store.commit('width', v)},
        },
        // beginner | intermediate | expert | custom 
        beginner:{
            get(){return this.$store.state.mode === 'beginner';},
            set(){this.$store.commit('mode', 'beginner')},
        },
        intermediate:{
            get(){return this.$store.state.mode === 'intermediate';},
            set(){this.$store.commit('mode', 'intermediate')},
        },
        expert:{
            get(){return this.$store.state.mode === 'expert';},
            set(){this.$store.commit('mode', 'expert')},
        },

    },
    methods: {
    }

}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>
