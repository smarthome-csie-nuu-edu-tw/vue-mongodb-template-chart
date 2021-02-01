<template>
  <div class="app--default-tips">
    <div class="container" @click="containerClick">
      <cy-icon-text :iconify-name="iconifyName" class="icon" />
      <div><slot></slot></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['iconifyName'],
  methods: {
    containerClick() {
      if (this.$listeners && this.$listeners['container-click'])
        this.$emit('container-click');
    }
  }
};
</script>
<style lang="less" scoped>
.app--default-tips {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > .container {
    cursor: pointer;
    padding: 1.3rem;
    transition: border-color 0.3s;
    text-align: center;

    > .icon {
      --icon-width: 7rem;
      margin-bottom: 1.5rem;
    }
  }
}
</style>