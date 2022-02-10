<template>
  <div class="ay-loading-wrap" :style="wrapStyle">
    <div class="ay-loading-content">
      <slot></slot>
    </div>
    <div class="ay-loading-loader" v-if="loading">
      <div class="loader" :style="loaderStyle"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AyLoading",
  props: {
    width: {
      type: Number,
      default: 40,
    },
    color: String,
    loading: {
      type: Boolean,
      required: true,
    },
    wrapStyle: Object,
  },
  computed: {
    loaderStyle() {
      const { width, color } = this;
      return {
        width: `${width}px`,
        height: `${width}px`,
        border: "4px solid #f3f3f3",
        borderTop: `4px solid ${color ? color : "#1989fa"}`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.ay-loading-wrap {
  position: relative;
  .ay-loading-content {
    position: relative;
  }
  .ay-loading-loader {
    @include abs-stretch;
    z-index: $loading-index;
    display: block;
    width: 100%;
    height: 100%;
    .loader {
      @include abs-center;
      border-radius: 50%;
      animation: rotate 1.2s infinite linear;
    }
  }
}
</style>
