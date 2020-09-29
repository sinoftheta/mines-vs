<template>
    <div>
        settings
        <textarea 
            v-model="userId" 
            placeholder="your id"
        ></textarea>
        <textarea 
            v-model="peerId" 
            placeholder="opponent id"
        ></textarea>
    </div>
</template>

<script>
import Nav from '@/components/Nav';

export default {
    name: 'Settings',
    components:{Nav},
    computed: {
        peerId:{
            get(){ return this.$store.state.peerId;},
            set(val){this.$store.commit('peerId', val);}
        },
        userId:{
            get(){ return this.$store.state.userId;},
            set(val){this.$store.commit('userId', val);}
        }
    },
    methods: {
    }

}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>
