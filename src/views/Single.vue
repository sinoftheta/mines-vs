<template>
    <div>
        <div>Solo</div>
        <canvas ref="boardCanvas"></canvas>
        <div>remaining: {{remainingMines}}</div>
        <PlayAgainBanner v-on:playAgainClick="playAgainClick" :show="showPlayAgainBanner" :gameWon="gameWon"/>
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
            remainingMines: this.$store.state.mines,
            showPlayAgainBanner: false,
            gameWon: false,
        };
    },
    methods:{
        onEnd(winStatus){
            // console.log("game over! win = ", winStatus);
            this.showPlayAgainBanner = true;
            this.gameWon = winStatus;

            // autoplay the next game if autoplay is on in the settings
            if(this.$store.state.autoPlay){
                this.autoPlayTimer = setTimeout(this.playAgainClick, 800);
            }
        },
        playAgainClick(){
            this.game = new SingleGame(
                this.$refs.boardCanvas,
                this.$store.state.height,
                this.$store.state.width,
                this.$store.state.mines,
                35,
                this.onEnd,
                this.updateRemainingMines
            );
            this.showPlayAgainBanner = false;
            this.updateRemainingMines(this.$store.state.mines); // reset remaining mines 

            clearTimeout(this.autoPlayTimer); // clear timeout in case play again button is pressed while autoplay is on

            
        },
        updateRemainingMines(mines){
            this.remainingMines = mines;
        }
    },
    mounted(){
        this.playAgainClick();
    }

}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
