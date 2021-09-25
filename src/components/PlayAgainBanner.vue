<template>
    <transition name="slide">
        <div class="banner" v-if="show">
            <div>
                <WinLossSVG :winStatus="winStatus" @playAgainClick="playAgainClick" @statusClick="statusClick"/>
            </div>
            <div v-if="multiplayer">
                {{opponentReady ? 'Opponent Ready' : 'Waiting on Opponent'}}
            </div>
        </div>
    </transition>
</template>

<script>
import WinLossSVG from "@/components/WinLossSVG.vue";


// banner states

// (play again) - (waiting)
// (play again) - (opponent ready)
// (ready)      - (waiting)

// autoplay toggle button

// win/loss/tie button

export default {
    name: "PlayAgainBanner",
    props: {
        playerReady: Boolean,
        opponentReady: Boolean,
        show: Boolean,
        winStatus: String,
        playAgain: Function,
        multiplayer: Boolean,
    },
    components:{
        WinLossSVG
    },
    methods: {
        playAgainClick() {
            this.$emit('playAgainClick');
            // trigger transition out
        },
        statusClick(won){
            console.log(won ? 'congradulations!' : 'sorry');
        }
    },
    computed: {
        autoplay: {
            get(){
                return this.$srore.state.autoplay;
            },
            set(){
                // i forget lol
            }
        }
    }
}
</script>

<style scoped>
* {
    --height: 70px;
}

@keyframes enter {
    from {
        transform: translateX(300vw);
    }
    to {
        transform: translateX(0vw);
    }
}
@keyframes exit {
    from {
        transform: translateX(0vw);
    }
    to {
        transform: translateX(-200vw);
    }
}

.slide-enter-active,
.slide-leave-active {
    animation-name: enter;
}
.slide-enter-from,
.slide-leave-to {
    animation-name: exit;
}

.banner{
    width: 300vw;
    height: var(--height);
    /*background: #00000040;*/
    background: linear-gradient(90deg, #00000000 0%, #00001060 33%, #00008055 66%, #00000000 100%);
    position: absolute;
    top: calc(50vh - var(--height) / 2);
    right: -100vw; 
    

    animation-duration: 400ms;
    animation-iteration-count: 1;

    display: flex;
    justify-content: center;

}
</style>