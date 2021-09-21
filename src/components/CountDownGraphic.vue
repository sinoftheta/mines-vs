<template>
    <div>
        <div :style="`
            animation-duration: ${ato3}ms;
            animation-delay: ${0}ms;
            `"
            class="banner-number"
        >
            3
        </div>
        <div :style="`
            animation-duration: ${ato3}ms;
            animation-delay: ${ato3}ms;
            `"
            class="banner-number"
        >
            2
        </div>
        <div :style="`
            animation-duration: ${ato3}ms;
            animation-delay: ${2 * ato3}ms;
            `"
            class="banner-number"
            @animationend="test"
        >
            1
        </div>
    </div>
</template>

<script>

export default {
    name: "CountDownGraphic",
    props:{
        animationTime: Number,
    },
    computed:{
        ato3(){
            return Math.floor(this.animationTime / 3);
        }
    },
    methods: {
        test(){
            // this works
            console.log("animation done!")
        }
    }
}
</script>

<style scoped>

*{
    --height: 200px;
    --width:  200px;
}

.banner-number{
    height: var(--height);
    width:  var(--width );

    position: absolute;
    top:   calc(50vh - var(--height) / 2);
    right: calc(50vw - var(--width ) / 2); 
    
    animation-iteration-count: 1;
    animation-name: number-pan;
    opacity: 0;

    font-size: 50px;
}

@keyframes number-pan{
    0%{
        transform: rotate(-20deg);
    }
    100%{
        transform: rotate(0deg);
        opacity: 1;
    }
}
</style>