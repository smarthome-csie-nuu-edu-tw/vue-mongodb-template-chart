<template>
  <article class="app--home">
    <user-menu v-if="userId !== null" />
    <group-content />
  </article>
</template>

<script>
  import vue_userMenu from "../../User/user-menu.vue";
  import vue_groupContent from "./group-content.vue";

  import store from "@store/user";
  import Vuex from 'vuex';

  export default {
    store,
    computed: {
      ...Vuex.mapState('user', {
        userId: '_id'
      })
    },
    components: {
      'user-menu': vue_userMenu,
      'group-content': vue_groupContent
    }
  };
</script>

<style lang="less" scoped>
  .app--home {
    display: flex;
  }
</style>