<template>
  <div class="body-wrap">
    <layout-menu />
    <div class="content" id="content__ref">
      <router-view :key="true"></router-view>
    </div>
  </div>
</template>

<script>
import LayoutMenu from "./menu.vue";
export default {
  name: "LayoutBody",
  components: { LayoutMenu },
};
</script>

<style lang="scss" scoped>
.body-wrap {
  display: flex;
  height: calc(100vh - 64px);
  padding-top: $header-height;
  .content {
    width: 100%;
    overflow-y: scroll;
    padding: 0 40px;
  }
}
</style>
