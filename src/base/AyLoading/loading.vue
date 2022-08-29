<template>
  <transition name="ay-fade">
    <div class="ay-loading" @click.stop="onClickLoading">
      <slot></slot>
      <div
        class="ay-loading__mask"
        :style="{ 'background-color': background }"
        v-if="loading"
      >
        <div class="ay-loading__loader"></div>
        <span class="ay-loading__title" v-if="title">{{ title }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AyLoading",
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    // 遮罩背景色
    background: String,
    // 显示在加载图标下方的加载文案
    title: String,
  },
  methods: {
    onClickLoading() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.ay-loading {
  position: relative;
  .ay-loading__mask {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    @include abs-stretch;
    @include flex-center(column);
    transition: opacity 0.3s;
    z-index: $loading-index;
    .ay-loading__loader {
      width: 30px;
      height: 30px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #1989fa;
      border-radius: 50%;
      animation: rotate 1.2s infinite linear;
    }
    .ay-loading__title {
      margin: 4px 0;
      color: #409eff;
      font-size: 14px;
    }
  }
}

.ay-fade-enter,
.ay-fade-leave-active {
  opacity: 0;
}
</style>
