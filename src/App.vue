<template>
  <div id="app">
    <Nav></Nav>
    <router-view />
    <!-- I would like to declare router-view as an import -->
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
