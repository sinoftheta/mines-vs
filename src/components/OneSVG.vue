<template>
    <!-- Generator: Adobe Illustrator 23.0.1, SVG Export Plug-In  -->
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="295.01px" height="375.82px" viewBox="0 0 295.01 375.82" style="enable-background:new 0 0 295.01 375.82; height:100%; width: 100%;"
        xml:space="preserve">
        <!-- https://developer.mozilla.org/en-US/docs/Web/SVG/Element/radialGradient -->
        <radialGradient id="fill-gradient-1"
                    spreadMethod="reflect"
        >
            <animate attributeName="fr" :dur="duration" from="15%" to="20%" repeatCount="indefinite" /> <!-- radius of the start circle of the radial gradient -->
            <animate attributeName="r"  :dur="duration" from="29%" to="36%" repeatCount="indefinite" /> <!-- radius of the end circle of the radial gradient -->
            <animate attributeName="cx" :dur="duration" from="73%" to="71%" repeatCount="indefinite" /> <!-- x coordinate of the end circle of the radial gradient -->
            <animate attributeName="cy" :dur="duration" from="22%" to="27%" repeatCount="indefinite" /> <!-- y coordinate of the end circle of the radial gradient -->
            <animate attributeName="fx" :dur="duration" from="64%" to="65%" repeatCount="indefinite" /> <!-- x coordinate of the start circle of the radial gradient -->
            <animate attributeName="fy" :dur="duration" from="30%" to="35%" repeatCount="indefinite" /> <!-- y coordinate of the start circle of the radial gradient -->
            <stop class="fill-stop-1" offset="0%" >
                <animate attributeName="stop-color" :dur="duration" values="#ff0fe7; #730fff;" repeatCount="indefinite" /> <!-- y coordinate of the start circle of the radial gradient -->
            </stop>
            <stop class="fill-stop-2" offset="100%" >
                <animate attributeName="stop-color" :dur="duration" values="#c70fff; #430fff;" repeatCount="indefinite" /> <!-- y coordinate of the start circle of the radial gradient -->
            </stop>

        </radialGradient>
        <linearGradient id="checker-gradient-1" x1="0" x2="0" y1="1" y2="0">
            <stop class="outline" offset="0%" />
            <stop class="outline" offset="100%" stop-opacity="0.5"/>
        </linearGradient>
        <g>
            <!-- polygon points="255.39,30.4 170.85,345.42 39.59,345.42 95.77,135.41 69.52,135.41 97.87,30.4 	"/ -->
            <path fill="url(#fill-gradient-1)"     d="M97.87,30.4L69.52,135.41h26.25L39.59,345.42h131.26L255.39,30.4H97.87z"/>
            <path fill="url(#checker-gradient-1)" d="M92.81,318.35H61.33v31.48h31.48V318.35z M155.77,318.35h-31.48v31.48h31.48V318.35z M61.33,286.87H29.86
                v31.48h31.48V286.87z M92.81,255.39H61.33v31.48h31.48V255.39z M124.29,286.87H92.81v31.48h31.48V286.87z M155.77,255.39h-31.48
                v31.48h31.48V255.39z M187.24,286.87h-31.48v31.48h31.48V286.87z M218.72,255.39h-31.48v31.48h31.48V255.39z M92.81,192.44H61.33
                v31.48h31.48V192.44z M124.29,223.92H92.81v31.48h31.48V223.92z M155.77,192.44h-31.48v31.48h31.48V192.44z M187.24,223.92h-31.48
                v31.48h31.48V223.92z M218.72,192.44h-31.48v31.48h31.48V192.44z M124.29,160.96H92.81v31.48h31.48V160.96z M187.24,160.96h-31.48
                v31.48h31.48V160.96z M250.2,160.96h-31.48v31.48L250.2,160.96z"/>
            <path class="outline" d="M74.6,0L29.83,165.8h26.35L0,375.82h194.17L295.01,0H74.6z M170.85,345.42H39.59l56.18-210.02H69.52L97.87,30.4h157.51
                L170.85,345.42z"/>
        </g>
    </svg>
</template>

<style scoped>
* {
    --outline-color: #180f29;
}
@keyframes status-line-text{
    0%{
        transform: translateX(0px);
        opacity: 1;
    }
    85%{
        transform: translateX(0px);
        opacity: 1;
    }
    100%{
        transform: translateX(var(--distance));
        opacity: 0;
    }
}
.outline {
    stop-color: var(--outline-color);
    fill:       var(--outline-color);
}

.fill-stop-2{
    stop-color: rgb(250, 92, 255);
}
.fill-stop-1{
    stop-color: rgb(149, 92, 255);
}

</style>

<script> export default { name: "OneSVG", data(){return {duration: "1200ms"}} }
</script>