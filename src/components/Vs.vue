<template>
    <div>
        versus
        <canvas ref="boardCanvas"></canvas>
        <Nav></Nav>
    </div>
</template>

<script>
import Nav from '@/components/Nav';
import MultiGame from '@/logic/multiGame.js';


export default {
    name: 'Vs',
    components:{Nav},
    computed: {
        //get settings from vuex
    },
    methods: {
        // board callbacks
    },
    mounted(){
        //console.log(this.$store.state.board.height);
        const game = new MultiGame(
            this.$refs.boardCanvas,
            this.$store.state.board.height,
            this.$store.state.board.width,
            this.$store.state.board.mines,
            this.$store.state.userId,
            this.$store.state.peerId,
            );
    }

}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>
