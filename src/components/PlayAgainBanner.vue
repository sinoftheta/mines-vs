<template>
    <transition name="slide">
        <div id="banner" v-if="show">
            <button @click="playAgainClick">PLay Again</button>
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
</style>