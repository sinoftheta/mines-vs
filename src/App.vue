<template>
  <div id="app">
    <Nav></Nav>
    <router-view />
  </div>
</template>

<script>
import Nav from '@/components/Nav';


export default {
  name: 'App',
  components: {
    Nav
  }
}
</script>
<style>
#app{
  height: 100vh;
  width: 100vw;
}
body {
  overflow: hidden;
  background-color: #2c2c5a !important;
  color: #dfcfcb !important;
}
</style>
