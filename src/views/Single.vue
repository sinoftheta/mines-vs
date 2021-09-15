<template>
    <div>
        <div>Solo</div>
        <canvas ref="boardCanvas"></canvas>
        <div>remaining: {{minesRemaining}}</div>
    </div>
</template>

<script>
import SingleGame from '@/logic/singleGame.js';

export default {
    name: 'Single',
    data: function () {
        this.game = null; // important https://stackoverflow.com/questions/68602389/maximum-call-stack-error-when-attempting-to-update-chart-in-vue-js
        return {
            minesRemaining: this.$store.state.mines
        };
    },
    methods:{
        onEnd(win){
            // play win/lose animation
            // show play again button
            
            // game.restart();
        },
    },
    mounted(){
        this.game = new SingleGame(
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
