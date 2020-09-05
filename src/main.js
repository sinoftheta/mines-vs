import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router/router';
import store from '@/store/store';

import 'bootstrap/dist/css/bootstrap.css';
//import 'bootswatch/dist/[theme]/bootstrap.min.css';

import VueClipboard from 'vue-clipboard2';
VueClipboard.config.autoSetContainer = true;

document.body.onmousedown = function(e) { if (e.button === 1) return false; };

Vue.use(VueClipboard);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.dispatch('init');
  }
}).$mount('#app');


document.addEventListener('fullscreenchange', (event) => {
  // document.fullscreenElement will point to the element that
  // is in fullscreen mode if there is one. If there isn't one,
  // the value of the property is null.
  if (document.fullscreenElement) {
    console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
  } else {
    console.log('Leaving full-screen mode.');
  }
});
