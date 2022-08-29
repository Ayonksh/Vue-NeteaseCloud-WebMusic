<template>
  <ay-popover class="theme" trigger="hover" placement="bottom-end">
    <div class="icon-wrapper">
      <ay-svg-icon class="icon" icon="skin" />
    </div>
    <template slot="content">
      <ul class="list">
        <li class="item" v-for="item in themeConfig" :key="item.title">
          <div class="item-footer">{{ item.title }}</div>
        </li>
      </ul>
    </template>
  </ay-popover>
</template>

<script>
import { AyPopover } from "@/base";
import themeConfig from "./themeConfig";
export default {
  name: "Theme",
  data() {
    return {
      themeConfig,
    };
  },
  components: { AyPopover },
};
</script>

<style lang="scss" scoped>
.theme {
  height: 100%;
  display: flex;
  align-items: center;
  .icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      font-size: 24px;
      cursor: pointer;
    }
  }
}
.list {
  width: 200px;
}
</style>
