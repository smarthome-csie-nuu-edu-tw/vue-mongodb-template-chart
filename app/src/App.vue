<template>
  <div id="app">
    <app-nav />
    <router-view class="main-section app-main" />
    <app-show-message />
  </div>
</template>

<script>
import vue_nav from "@views/app/nav.vue";
import vue_showMessage from "@views/app/show-message.vue";

export default {
  name: 'App',
  components: {
    'app-nav': vue_nav,
    'app-show-message': vue_showMessage
  }
}
</script>

<style>
</style>
