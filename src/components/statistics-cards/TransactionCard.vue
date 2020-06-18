<template>
    <div id="transaction-card">
        <vx-card class="h-48">
            <div class="flex justify-between">
              <div class="text-2xl text-left p-3 w-1/2">{{title}}</div>
              <div class="flex items-center">
                <feather-icon icon="HashIcon"></feather-icon>
              </div>
            </div>
            <div class="flex justify-between">
              <div class="text-5xl bold text-left p-3" v-if="!transition">{{amount}}</div>
              <!-- SHIMMER TRANSITION -->
              <div v-else class="skeleton-box inline-block h-8 w-1/3 mt-10"></div>
            </div>
        </vx-card>
    </div>
</template>

<script>
export default {
    data(){

    },
    props: {
      title: String,
      amount: Number,
      imageUrl: String,
      transition: Boolean
    },
    mounted() {
      console.log(this.transition);
    }
}
</script>
<style lang="scss" scoped>
  .skeleton-box {
    display: inline-block;
    position: relative;
    background: #DDDBDD;
    &::after {
      content: '';
      transform: translateX(-100%);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(
        90deg,
        rgba(#fff, 0) 0,
        rgba(#fff, 0.2) 20%,
        rgba(#fff, 0.5) 60%,
        rgba(#fff, 0)
      );
      animation: shimmer 2s infinite;
    }
  }
  .theme-dark {
    .skeleton-box {
      display: inline-block;
      position: relative;
      background: gray;
      &::after {
        content: '';
        transform: translateX(-100%);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: linear-gradient(
          90deg,
          rgba(#262c49, 0) 0,
          rgba(#262c49, 0.2) 20%,
          rgba(#262c49, 0.5) 60%,
          rgba(#262c49, 0)
        );
        animation: shimmer 2s infinite;
      }
    }
  }
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
</style>