import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router/router';
import store from '@/store/store';

import 'bootstrap/dist/css/bootstrap.css';
//import 'bootswatch/dist/[theme]/bootstrap.min.css';
import VueClipboard from 'vue-clipboard2';

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);
Vue.config.productionTip = false;

document.body.onmousedown = function(e) { if (e.button === 1) return false; };

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.dispatch('init');
  }
}).$mount('#app');
