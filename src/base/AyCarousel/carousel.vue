<template>
  <div
    class="ay-carousel-wrap"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="ay-carousel" :style="{ height: height }">
      <slot></slot>
    </div>
    <div class="ay-carousel-control">
      <div
        class="ay-carousel-control__left ay-carousel-control__trigger"
        @click.stop="prev"
      >
        <img
          class="icon"
          :src="require('@/assets/icon/arrow-left-bold-dark.png')"
        />
      </div>
      <div
        class="ay-carousel-control__right ay-carousel-control__trigger"
        @click.stop="next"
      >
        <img
          class="icon"
          :src="require('@/assets/icon/arrow-right-bold-dark.png')"
        />
      </div>
    </div>
    <div class="ay-carousel-indicator">
      <div
        class="ay-carousel-indicator__item"
        :class="
          activeIndex === index ? 'ay-carousel-indicator__item__active' : ''
        "
        v-for="(item, index) in items"
        :key="index"
        @mouseenter="throttledIndicatorHover(index)"
        @click="handleIndicatorClick(index)"
      ></div>
    </div>
  </div>
</template>

<script>
import { throttle } from "throttle-debounce";
export default {
  name: "AyCarousel",
  props: {
    height: {
      type: String,
      default: "200px",
    },
    trigger: {
      type: String,
      default: "hover",
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      items: [],
      activeIndex: -1,
      timer: null,
      hover: false,
    };
  },
  created() {
    this.throttledIndicatorHover = throttle(300, (index) => {
      this.handleIndicatorHover(index);
    });
  },
  mounted() {
    this.updateItems();
    this.activeIndex = 0;
    this.startTimer();
  },
  watch: {
    activeIndex() {
      this.resetItemPosition();
    },
    autoplay(value) {
      value ? this.startTimer() : this.pauseTimer();
    },
  },
  methods: {
    handleMouseEnter() {
      this.hover = true;
      this.pauseTimer();
    },
    handleMouseLeave() {
      this.hover = false;
      this.startTimer();
    },
    handleIndicatorClick(index) {
      this.activeIndex = index;
    },
    handleIndicatorHover(index) {
      if (this.trigger === "hover" && index !== this.activeIndex) {
        this.activeIndex = index;
      }
    },
    startTimer() {
      if (this.interval <= 0 || !this.autoplay || this.timer) return;
      this.timer = setInterval(this.next, this.interval);
    },
    pauseTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    updateItems() {
      this.items = this.$children.filter(
        (child) => child.$options.name === "AyCarouselItem"
      );
    },
    getPrevIndex(activeIndex = this.activeIndex) {
      let index = activeIndex - 1;
      return index < 0 ? this.items.length - 1 : index;
    },
    getNextIndex(activeIndex = this.activeIndex) {
      let index = activeIndex + 1;
      return index > this.items.length - 1 ? 0 : index;
    },
    prev() {
      this.activeIndex = this.getPrevIndex();
    },
    next() {
      this.activeIndex = this.getNextIndex();
    },
    resetItemPosition() {
      this.items.forEach((item, index) => {
        item.translateItem(index, this.activeIndex);
      });
    },
  },
  beforeDestroy() {
    this.pauseTimer();
  },
};
</script>

<style lang="scss" scoped>
.ay-carousel-wrap {
  margin: 0 auto;
  position: relative;
  &:hover {
    .ay-carousel-control {
      display: block;
    }
  }
  .ay-carousel {
    position: relative;
    overflow: hidden;
  }
  .ay-carousel-control {
    display: none;
    width: 100%;
    height: 100%;
    color: $black;
    &__trigger {
      position: absolute;
      cursor: pointer;
      height: 90%;
      bottom: 0;
      width: 46px;
      z-index: $carousel-trigger-index;
      .icon {
        position: absolute;
        top: 42%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
      }
    }
    &__left {
      left: 0;
    }
    &__right {
      right: 0;
    }
  }
  .ay-carousel-indicator {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -10%;
    display: flex;
    &__item {
      width: 6px;
      height: 6px;
      cursor: pointer;
      border-radius: 6px;
      background: $grey;
      margin: 0 6px;
      &__active {
        background: $theme-color;
      }
    }
  }
}
</style>
