<template>
    <div>
        <div>versus</div>
        <canvas ref="boardCanvas"></canvas>
        <div>
            <div>connect code</div>
            <input type="text" v-model="userConnectCode">
            <button type="button" @click="copyCode"> <!--{{copyStatus}} -->
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-clipboard" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                    <path fill-rule="evenodd" d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                </svg>
            </button>
        </div>
        <div>
            <input 
                type="text" 
                v-model="opponentConnectCode" 
                placeholder="opponent code"
                @input="setOpponentCode"
            >
        </div>
        <Nav></Nav>
    </div>
</template>

<script>
import Nav from '@/components/Nav';
import MultiGame from '@/logic/multiGame.js';

var game;

export default {
    name: 'Vs',
    components:{Nav},
    data(){
        return {
            userConnectCode: 'generating code...',
            opponentConnectCode: '',
            //copyStatus: 'copy',
    }},
    methods:{
        setUserConnectCode(code){
            //console.log('dat code:', code)
            this.userConnectCode = code;
            //this.$set(this.data, 'userConnectCode', code);
            //this.gettingCode = false;
        },
        copyCode() {
            this.$copyText(this.userConnectCode)
            .then(
                (e) => { //copy success
                    //alert('Copied!');
                    //console.log(e);
                    //console.log('copied!');
                }, 
                (e) => { // copy failed
                    alert('Failed To Copy!');
                    //console.log(e);
                }
            )
        },
        setOpponentCode(e){
            //console.log(e.target.value)
            game.opponentCode = e.target.value;
        }
    },
    mounted(){
        game = new MultiGame(
            this.$refs.boardCanvas,
            this.$store.state.board.height,
            this.$store.state.board.width,
            this.$store.state.board.mines,
            (code) => this.setUserConnectCode(code)
            );
    }

}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
