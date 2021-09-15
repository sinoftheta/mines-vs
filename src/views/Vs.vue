<template>
    <div>
        <div>versus</div>
        <!--div>{{userScore}}</div>
        <div>{{opponentScore}}</div>
        <div>{{minesRemaining}}</div-->
        <canvas ref="boardCanvas"></canvas>
        <div>
            <div>your connect code</div>
            <input type="text" v-model="userConnectCode">
            <button type="button" @click="copyCode"> <!--{{copyStatus}} -->
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-clipboard" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                    <path fill-rule="evenodd" d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                </svg>
            </button>
        </div>
        <!--div>
            <div>challenge link</div>
            <input type="text" :value="challengeUrl()">
            <button type="button" @click="copyChallengeLink"> {{copyStatus}} 
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-clipboard" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                    <path fill-rule="evenodd" d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                </svg>
            </button>
        </div-->
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
</template>

<script>
import MultiGame from '@/logic/multiGame.js';

export default {
    name: 'Vs',
    data: function(){

        this.game = null;
        return {
            userConnectCode: 'generating code...',
            opponentConnectCode: '',
            userScore: 0,
            opponentScore: 0,
            minesRemaining: 0
        }
    },
    methods:{
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
        startCountDown(time){
            //spawn count down modal
            console.log('counting down:', time);
        },
        challengeUrl(){
            return window.location.href.split('#')[0] + '#/vs?challenge=' + this.userConnectCode;
        }

    },
    mounted(){

        // check for challenge url param
        if(this.$route.query.challenge){
            // wait until user's connect codee is generated and set it
            console.log('opponent code:',this.$route.query.challenge);
        }
        
        this.game = new MultiGame(
            this.$refs.boardCanvas,
            this.$store.state.height,
            this.$store.state.width,
            this.$store.state.mines,
            35,
            (code) => this.setUserConnectCode(code),
            this.startCountDown
            );
    }

}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
