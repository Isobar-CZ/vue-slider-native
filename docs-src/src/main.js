import Vue from 'vue'
import App from './App.vue'
import 'normalize.css'

import VueScrollTo from 'vue-scrollto';

Vue.use(VueScrollTo);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
