<template>
    <transition name="slide">
        <div id="banner" v-if="show">
            <div>You {{gameWon ? "won" : "lost"}}!</div>
            <button @click="playAgainClick">Play again?</button>
        </div>
    </transition>
</template>

<script>
export default {
    name: "PlayAgainBanner",
    props: {
        gameWon: Boolean,
        multiPlayer: Boolean,
        playAgain: Function
    },
    methods: {
        playAgainClick() {
            console.log("button clicked")
            this.$emit('playAgain');
            // trigger transition out
        }
    },
    computed:{
        show(){
            return true;
        }
    }
}
</script>

<style scoped>
* {
    --height: 50px;
}

.slide-enter-active,
.slide-leave-active {
  margin-right: 0;
  transition: all 420ms ease;
}
.slide-enter-from,
.slide-leave-to {
  margin-right: -25vw;
  transition: all 420ms ease;
}



#banner{
    width: 100vw;
    height: var(--height);
    background: #00000040;
    position: absolute;
    top: calc(50vh - var(--height) / 2);

    display: flex;
    flex-direction: column;
    justify-content: center;

}
</style>