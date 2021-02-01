<template>
  <div class="main--user-menu">
    <div v-if="userId != null">
      <div class="top-content">
        <cy-icon-text iconify-name="mdi-rabbit" class="text-large">
          {{ userAttrs.nickname }}
        </cy-icon-text>
      </div>
    </div>
    <cy-default-tips v-else iconify-name="bx-bxs-user-x">
      尚未<router-link to="/login">登入</router-link>
    </cy-default-tips>
  </div>
</template>
<script>
  import store from "@store/user";

  import Vuex from 'vuex';

  export default {
    store,
    computed: {
      ...Vuex.mapState('user', {
        userId: '_id',
        userAttrs: 'attrs'
      })
    }
  };
</script>
<style lang="less" scoped>
  @deep-operator: ~'>>>';

  .main--user-menu {
    width: 20rem;
    background-color: rgba(var(--rgb-black), 0.14);
    padding: 1rem
  }
  .top-content {
  }
</style>