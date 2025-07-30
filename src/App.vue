<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// 主应用组件
</script>

<style lang="less" scoped>
@import './style.less';

#app {
  min-height: 100vh;
  font-family: @font-family-base;
  color: @text-color;
  background-color: @bg-color;
  line-height: @line-height;
}
</style>