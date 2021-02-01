<template>
  <article class="app--group">
    <user-menu />
    <group-main />
    <group-members />
  </article>
</template>

<script>
  import vue_userMenu from "../User/user-menu.vue";
  import vue_groupMain from "./group-main.vue";
  import vue_groupMembers from "./group-members.vue";

  export default {
    components: {
      'user-menu': vue_userMenu,
      'group-main': vue_groupMain,
      'group-members': vue_groupMembers
    }
  };
</script>

<style lang="less" scoped>
  .app--group {
    display: flex;
  }
</style>