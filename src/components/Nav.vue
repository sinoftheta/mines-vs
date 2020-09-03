<template>
    <div>
        <button @click="goto('vs')"> versus </button>
        <button  @click="goto('settings')"> settings </button>
    </div>
</template>

<script>

export default {
    name: 'Nav',
    methods: {goto(route){this.$router.push({path: route});}}
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>
