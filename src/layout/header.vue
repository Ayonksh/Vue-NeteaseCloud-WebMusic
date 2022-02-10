<template>
  <div class="header-wrap">
    <div class="left">
      <div class="item-home" @click="toHome">
        <div class="logo">
          <img :src="require('@/assets/head/logo.png')" />
        </div>
        <div class="title">网 易 云 音 乐</div>
      </div>
      <div class="item"><history-control></history-control></div>
      <div class="item"><search></search></div>
    </div>
    <div class="right">
      <div class="item"><user></user></div>
      <div class="item"><message></message></div>
      <div class="item"><theme></theme></div>
      <div class="item"><setting></setting></div>
      <div class="item"><github></github></div>
    </div>
  </div>
</template>

<script>
import {
  HistoryControl,
  Search,
  User,
  Message,
  Theme,
  Setting,
  Github,
} from "@/components";
import { userMixin } from "@/utils";
export default {
  name: "LayoutHeader",
  mixins: [userMixin],
  components: { HistoryControl, Search, User, Message, Theme, Setting, Github },
  methods: {
    toHome() {
      this.$router.push({ name: "Layout" });
    },
  },
};
</script>

<style lang="scss" scoped>
.header-wrap {
  position: fixed;
  width: 100%;
  height: $header-height;
  line-height: $header-height; // 子组件会继承该属性，将对子组件的css写法产生影响
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  color: $white;
  background-color: $theme-color;
  z-index: $header-index;
  .left {
    display: flex;
    .item-home {
      width: 200px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .logo {
        @include circle(32px);
        background-color: $white;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          height: 30px;
          width: 30px;
        }
      }
      .title {
        margin: 0 20px;
        font-weight: bold;
        font-size: $font-size-lg;
      }
    }
  }
  .right {
    display: flex;
  }
  .item {
    margin: 0 10px;
  }
}
</style>
