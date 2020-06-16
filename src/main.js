/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import App from './App.vue'
import Vuetify from "vuetify";

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css'; // Vuesax
import VueAnalytics from "vue-analytics";

// Vue Router
import router from './router'

Vue.use(Vuesax)
Vue.use(Vuetify);
Vue.use(VueAnalytics, {
  id: 'UA-155410476-1',
  router
});
Vue.use(require("vue-moment"));


// axios
import axios from 'axios'
Vue.prototype.$http = axios

// Theme Configurations
import '../themeConfig.js'


// Algolia - Instant Search
import InstantSearch from 'vue-instantsearch';
Vue.use(InstantSearch);


// Firebase
import '@/firebase/firebaseConfig'


// Auth0 Plugin
import AuthPlugin from "./plugins/auth";
Vue.use(AuthPlugin);


// ACL
import acl from './acl/acl'


// Globally Registered Components
import './globalComponents.js'


// Styles: SCSS
import './assets/scss/main.scss'


// Tailwind
import '@/assets/css/main.css';


// Vuex Store
import store from './store/store'


// i18n
import i18n from './i18n/i18n'


// Vuesax Admin Filters
import './filters/filters'


// Clipboard
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard);

Vue.filter("handleFloat", function(number, digits) {
  if (Math.abs(parseFloat(number)) > 1) {
    return (parseFloat(number)).toFixed(digits);
  } else {
    return Number.parseFloat(number).toPrecision(digits);
  }
});
Vue.filter('toCurrencyFloat', function (value, digits) {
  if (typeof value !== "number") {
      return value;
  }
  var formatter = new Intl.NumberFormat('en-US', {
      maximumFractionDigits:digits
  });
  if (Math.abs(value) >= 1) {
    return formatter.format(value);
  } else {
    return Number.parseFloat(value).toPrecision(digits);
  }
});
// Tour
import VueTour from 'vue-tour'
Vue.use(VueTour)
require('vue-tour/dist/vue-tour.css')


// VeeValidate
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);


// Google Maps
import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
    load: {
        // Add your API key here
        key: 'YOUR_KEY',
        libraries: 'places', // This is required if you use the Auto complete plug-in
    },
})


// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'


// Feather font icon
require('./assets/css/iconfont.css')


Vue.config.productionTip = false

new Vue({
    router,
    store,
    i18n,
    acl,
    render: h => h(App)
}).$mount('#app')
