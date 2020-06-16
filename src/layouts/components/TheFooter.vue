<!-- =========================================================================================
    File Name: TheFooter.vue
    Description: Footer component
    Component Name: TheFooter
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <!-- <footer class="the-footer flex-wrap center" :class="classes"> -->
        <!-- <span class="md:flex hidden items-center"> -->
          <span style="display: flex; position: relative; top: 40px; justify-content: center; padding-bottom: 20px;">COPYRIGHT @{{ new Date().getFullYear()}}&nbsp;<a href="https://nuo.network" target="_blank" rel="nofollow">Nuo</a>, All rights Reserved</span>
        <!-- </span> -->
    <!-- </footer> -->
</template>

<script>
export default {
    name: "the-footer",
    props: {
        classes: {
            type: String,
        },
    }
}
</script>
