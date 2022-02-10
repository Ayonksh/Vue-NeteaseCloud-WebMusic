<template>
  <ay-popover trigger="click" placement="bottom-end" :wrapStyle="popoverStyle">
    <div class="theme">
      <div class="img-wrap">
        <img :src="require('@/assets/head/skin.png')" />
      </div>
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
      popoverStyle: {
        margin: "0",
      },
      themeConfig,
    };
  },
  components: { AyPopover },
};
</script>

<style lang="scss" scoped>
.theme {
  height: $header-height;
  display: flex;
  align-items: center;
  .img-wrap {
    display: flex;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
    }
  }
}
.list {
  width: 200px;
}
</style>
