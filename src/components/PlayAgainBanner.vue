<template>
    <transition name="slide">
        <div class="banner" v-if="show">
            <div>
                <WinLossSVG :gameWon="gameWon" @playAgainClick="playAgainClick" @statusClick="statusClick"/>
            </div>
        </div>
    </transition>
</template>

<script>
import WinLossSVG from "@/components/WinLossSVG.vue";

export default {
    name: "PlayAgainBanner",
    props: {
        show: Boolean,
        gameWon: String,
        playAgain: Function,
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
    computed:{
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