<template>
  <div class="wrapper">
    <div class="logo">
      <img :src="require('@/assets/images/logo/logo-color-demibold.png')" alt="nuo-logo">
    </div>
    <div class="coming-soon-text">
      We will be back up soon.
    </div>
    <div class="footer-text">
      Follow our updates on <a href="https://t.me/officialnuo">Telegram</a>
    </div>
  </div>
</template>
<script>
</script>
<style>
.logo {
  display: flex;
  justify-content: center;
}
.coming-soon-text {
  display: flex;
  justify-content: center;
  color: #3576fd;
  font-weight: 600;
  font-size: 50px;
  padding: 20px;
  text-align: center;
}
.footer-text {
  font-size: 24px;
  font-weight: 400;
  opacity: 0.5;
  margin-bottom: 40px;
  margin: auto;
  text-align: center;
}
</style>