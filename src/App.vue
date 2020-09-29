<template>
  <div id="app">
    <router-view />
    <!-- I would like to declare router-view as an import -->
    <Nav></Nav>
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
