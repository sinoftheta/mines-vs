<template>
    <div>
        <div :style="`
            animation-duration: ${ato3}ms;
            animation-delay: ${0}ms;
            `"
            class="banner-number"
        >
            <ThreeSVG/>
        </div>
        <div :style="`
            animation-duration: ${ato3}ms;
            animation-delay: ${ato3}ms;
            `"
            class="banner-number"
        >
            <TwoSVG/>
        </div>
        <div :style="`
            animation-duration: ${ato3}ms;
            animation-delay: ${2 * ato3}ms;
            `"
            class="banner-number"
            @animationend="test"
        >
            <OneSVG/>
        </div>
    </div>
</template>

<script>
import OneSVG from "@/components/OneSVG.vue";
import TwoSVG from "@/components/TwoSVG.vue";
import ThreeSVG from "@/components/ThreeSVG.vue";


export default {
    name: "CountDownGraphic",
    props:{
        animationTime: Number,
    },
    components:{
        OneSVG,
        TwoSVG,
        ThreeSVG
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
}

@keyframes number-pan{
    0%{
        transform: translateY(20px);
    }
    100%{
        transform: translateY(-20px);
        opacity: 1;
    }
}
</style>