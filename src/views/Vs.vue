<template>
    <div class="container">
        <div>versus</div>
        <canvas ref="boardCanvas"></canvas>
        <!--div>{{userScore}}</div>
        <div>{{opponentScore}}</div>
        <div>{{minesRemaining}}</div-->
        <CountDownGraphic :animationTime="cdAnimationTime" v-if="showCountDown"/>
        <PlayAgainBanner 
            @playAgainClick="playAgainClick" 
            :show="showPlayAgainBanner" 
            :gameWon="gameWon" 
            :opponentReady="opponentReady" 
            :multiplayer="true"
        />
        <div>
            <div>
                <div>your connect code</div>
                <input type="text" v-model="userConnectCode">
                <button @click="copyCode"> <!--{{copyStatus}} -->
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-clipboard" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                        <path fill-rule="evenodd" d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                    </svg>
                </button>
                <button  @click="copyChallengeLink"> <!--{{copyStatus}} -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                    </svg>
                </button>
            </div>
            <div>
                <div>opponent connect code</div>
                <input 
                    type="text" 
                    v-model="opponentConnectCode" 
                    placeholder="paste code here"
                    @input="setOpponentCode"
                >
            </div>
        </div>
    </div>
</template>

<script>
import MultiGame from '@/logic/multiGame.js';
import CountDownGraphic from '@/components/CountDownGraphic.vue';
import PlayAgainBanner from "@/components/PlayAgainBanner.vue";
import {win, loss, tie} from '@/logic/const.js';

export default {
    name: 'Vs',
    data: function(){
        this.autoPlayTimer = null;
        this.game = null;
        return {
            userConnectCode: 'generating code...',
            opponentConnectCode: '',
            showPlayAgainBanner: false,
            gameWon: null,
            cdAnimationTime: 2300,
            showCountDown: false,
            opponentReady: false,
        }
    },
    components: {
        CountDownGraphic,
        PlayAgainBanner
    },
    methods:{
        //TODO
        onEnd(winStatus){ // winStatus can be: win, loss, tie
            // console.log("game over! win = ", winStatus);
            this.showPlayAgainBanner = true;
            this.gameWon = winStatus;

            // autoplay the next game if autoplay is on in the settings
            if(this.$store.state.autoPlay){
                this.autoPlayTimer = setTimeout(this.playAgainClick, 800);
            }
        },
        setUserConnectCode(code){
            //console.log('dat code:', code)
            this.userConnectCode = code;
            //this.$set(this.data, 'userConnectCode', code);
            //this.gettingCode = false;
        },
        copyCode() {
            this.$copyText(this.userConnectCode); // returns a promise (can usue .then())
        },
        copyChallengeLink(){
            this.$copyText(this.challengeUrl());
        },
        setOpponentCode(e){this.game.opponentCode = e.target.value;},

        // ***needs refactor with promise*** 
        startCountDown(time){
            console.log('counting down:', time);

            //spawn count down modal
            this.showCountDown = true;
            setTimeout(() => {this.showCountDown = false;}, time);
            
        },
        challengeUrl(){ // maybe shoul be a computed
            return window.location.href.split('#')[0] + '#/vs?challenge=' + this.userConnectCode;
        },
        onCodeGenerate(code){
            this.setUserConnectCode(code);

            // check for challenge url param (cannot connect to another peer before we have generated our own code)
            if(this.$route.query.challenge){
                // wait until user's connect codee is generated and set it
                // console.log('opponent code:',this.$route.query.challenge);

                this.opponentConnectCode = this.$route.query.challenge;
                this.game.opponentCode = this.$route.query.challenge;
            }
        },
        onOpponentReady(){this.opponentReady = true;},
        playAgainClick(){
            this.game.userReady();

            // reset timer
            // reset remaining mines 

            this.showPlayAgainBanner = false;
            this.opponentReady = false;
            clearTimeout(this.autoPlayTimer);
        }

    },
    mounted(){
        this.game = new MultiGame(
            this.$refs.boardCanvas,
            this.$store.state.height,
            this.$store.state.width,
            this.$store.state.mines,
            35, // TODO: put this in vuex
            this.cdAnimationTime,
            this.onCodeGenerate,
            this.startCountDown,
            this.onEnd,
            this.onOpponentReady
            // TODO: this.updateRemainingMines
            );
    }

}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>
