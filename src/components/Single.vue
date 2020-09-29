<template>
    <div>
        <div>Solo</div>
        <div>{{minesRemaining}}</div>
        <canvas ref="boardCanvas"></canvas>
    </div>
</template>

<script>
import Nav from '@/components/Nav';
import SingleGame from '@/logic/singleGame.js';

var game;

export default {
    name: 'Single',
    components:{Nav},
    data(){
        return {
            minesRemaining: 0
    }},
    methods:{
    },
    mounted(){
        game = new SingleGame(
            this.$refs.boardCanvas,
            this.$store.state.height,
            this.$store.state.width,
            this.$store.state.mines,
            35
            );
    }

}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
