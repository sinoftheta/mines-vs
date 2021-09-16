<template>
    <div>
        <div>Solo</div>
        <canvas ref="boardCanvas"></canvas>
        <div>remaining: {{minesRemaining}}</div>
        <PlayAgainBanner v-on:playAgain="playAgain"/>
    </div>
</template>

<script>
import SingleGame from '@/logic/singleGame.js';
import PlayAgainBanner from "@/components/PlayAgainBanner.vue";

export default {
    name: 'Single',
    components: {
        PlayAgainBanner
    },
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



        },
        playAgain(){
            console.log('playAgain()');
            this.game = new SingleGame(
            this.$refs.boardCanvas,
            this.$store.state.height,
            this.$store.state.width,
            this.$store.state.mines,
            35
        );
        }
    },
    mounted(){
        console.log('mounted()');
        this.playAgain();
    }

}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
