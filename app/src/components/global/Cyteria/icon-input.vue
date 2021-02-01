<template>
  <span class="cy--icon-input">
    <span class="pretext">
      <slot name="pretext"></slot>
    </span>
    <slot></slot>
  </span>
</template>
<script>
export default {
  props: {
    iconifyName: {
      default: null
    },
    iconId: {
      default: null
    }
  }
}
</script>
<style lang="less" scoped>
.cy--icon-input {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  --input-left-space: 2rem;
  margin: 0.2rem;

  &>.pretext {
    left: 0.2rem;
    top: 0.15rem;
    position: absolute;
    color: var(--primary-light-3);
  }

  &>input {
    padding: 0.3rem 0.2rem;
    border: 0;
    border-bottom: 1px solid var(--primary-light);
    transition: 0.3s;
    font-size: 1rem;
    width: 20rem;
    padding-left: var(--input-left-space);
  }

  &>input:focus {
    border-bottom-color: var(--primary-light-3);
  }
}

@media screen and (max-width: 24rem) {
  .title-input>input {
    width: 100%;
  }
}
</style>