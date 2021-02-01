<template>
  <section class="main--">
    <div class="container">
      <cy-icon-text iconify-name="mdi-food-apple" class="icon" />
      <cy-icon-text iconify-name="bx-bx-message-rounded-x" class="fix-icon" />
      <div class="text">Apple Not Found</div>
    </div>
  </section>
</template>
<script>
  export default {};
</script>
<style lang="less" scoped>
.main-- {
  width: 100%;
  height: calc(100vh - 15rem);
  display: flex;
  align-items: center;
  justify-content: center;

  > .container {
    text-align: center;
    position: relative;

    > .icon {
      --icon-width: 8rem;
      margin-bottom: 1.8rem;
    }
    > .text {
      font-size: 2rem;
    }

    > .fix-icon {
      --icon-width: 4rem;
      position: absolute;
      top: -2.5rem;
      right: 0.4rem;
    }
  }
}
</style>