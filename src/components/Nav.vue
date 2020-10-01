<template>
    <div>
        <!-- TODO: animate in/out instead of v-show -->
        <button v-show="currentRouteName != 'Vs'"  @click="goto('vs')"> versus </button>
        <button  v-show="currentRouteName != 'Settings'" @click="goto('settings')"> settings </button>
        <button  v-show="currentRouteName != 'Single'" @click="goto('solo')"> solo </button>
    </div>
</template>
<script>

export default {
    name: 'Nav',
    methods: {
        goto(route)
        {this.$router.push({path: route});}
    },
    computed:{
        currentRouteName() {
            console.log('route name', this.$route.name);
            return this.$route.name;
        }
    }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>
