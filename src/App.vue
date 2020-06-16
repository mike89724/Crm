<!-- =========================================================================================
	File Name: App.vue
	Description: Main vue file - APP
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Author: Pixinvent
	Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
// import themeConfig from '@/../themeConfig.js'
import { getVersionCode } from "@/static/util.js";

export default {
  watch: {
      '$store.state.theme'(val) {
          this.toggleClassInBody(val);
      }
  },
  async created() {
    try {
      await this.$auth.renewTokens();
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
      toggleClassInBody(className) {
          if (className == 'dark') {
              if (document.body.className.match('theme-semi-dark')) document.body.classList.remove('theme-semi-dark');
              document.body.classList.add('theme-dark');
          } else if (className == 'semi-dark') {
              if (document.body.className.match('theme-dark')) document.body.classList.remove('theme-dark');
              document.body.classList.add('theme-semi-dark');
          } else {
              if (document.body.className.match('theme-dark')) document.body.classList.remove('theme-dark');
              if (document.body.className.match('theme-semi-dark')) document.body.classList.remove('theme-semi-dark');
          }
      }
  },
  mounted() {
      this.toggleClassInBody(this.$store.state.theme)
      if (!this.$store.state.versionCode ||
      this.$store.state.versionCode !== getVersionCode()) {
        this.$store.dispatch("resetState");
      }
      // var self = this;
      // self.$store.dispatch("hideModal", "searchResults");

      // window.onpopstate = function(event) {
      //   self.$store.dispatch("hideModal", "searchResults");
      // }
  }
}
</script>
