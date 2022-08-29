<template>
  <div
    class="ay-carousel"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="ay-carousel__body" :style="{ height: height }">
      <slot></slot>
      <transition v-if="arrowDisplay" name="ay-arrow-left">
        <div
          class="ay-carousel__arrow ay-carousel__arrow--left"
          v-show="arrow === 'always' || hover"
          @click.stop="prev"
        >
          <ay-svg-icon class="icon" icon="arrow-left-white" />
        </div>
      </transition>
      <transition v-if="arrowDisplay" name="ay-arrow-right">
        <div
          class="ay-carousel__arrow ay-carousel__arrow--right"
          v-show="arrow === 'always' || hover"
          @click.stop="next"
        >
          <ay-svg-icon class="icon" icon="arrow-right-white" />
        </div>
      </transition>
    </div>
    <ul
      v-if="indicatorPosition !== 'none'"
      class="ay-carousel__indicator"
      :style="indicatorStyle"
    >
      <li
        class="ay-carousel__indicator-item"
        :class="
          activeIndex === index ? 'ay-carousel__indicator-item--active' : ''
        "
        v-for="(item, index) in items"
        :key="index"
        @mouseenter="throttledIndicatorHover(index)"
        @click.stop="handleIndicatorClick(index)"
      ></li>
    </ul>
  </div>
</template>

<script>
import { throttle } from "throttle-debounce";
export default {
  name: "AyCarousel",
  props: {
    initialIndex: {
      type: Number,
      default: 0,
    },
    height: {
      type: String,
      default: "300px",
    },
    trigger: {
      type: String,
      default: "hover",
      validator: (value) => ["click", "hover"].indexOf(value) > -1,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 3000,
    },
    type: {
      type: String,
      default: "",
      validator: (value) => ["", "card"].indexOf(value) > -1,
    },
    arrow: {
      type: String,
      default: "hover",
      validator: (value) => ["always", "hover", "never"].indexOf(value) > -1,
    },
    indicatorPosition: {
      type: String,
      default: "",
      validator: (value) => ["", "none", "outside"].indexOf(value) > -1,
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
    this.$nextTick(() => {
      if (this.initialIndex < this.items.length && this.initialIndex >= 0) {
        this.activeIndex = this.initialIndex;
      }
      this.startTimer();
    });
  },
  computed: {
    arrowDisplay() {
      return this.arrow !== "never";
    },
    indicatorStyle() {
      if (this.indicatorPosition === "outside" || this.type === "card") {
        return {
          position: "static",
          justifyContent: "center",
          alignItems: "center",
        };
      } else {
        return {
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
        };
      }
    },
  },
  watch: {
    activeIndex(val, oldVal) {
      this.resetItemPosition();
      this.$emit("change", val, oldVal);
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
    resetTimer() {
      this.pauseTimer();
      this.startTimer();
    },
    updateItems() {
      this.items = this.$children.filter(
        (child) => child.$options.name === "AyCarouselItem"
      );
    },
    setActiveIndex(index) {
      this.activeIndex = index;
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
.ay-carousel {
  position: relative;
  .ay-carousel__body {
    position: relative;
    overflow: hidden;
    .ay-carousel__arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      @include circle(36px);
      background-color: $blue-light;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: transform 0.5s ease-in-out;
      z-index: $carousel-trigger-index;
      .icon {
        font-size: 12px;
      }
      &--left {
        left: 16px;
      }
      &--right {
        right: 16px;
      }
      &:hover {
        background-color: $blue;
      }
    }
  }
  .ay-carousel__indicator {
    display: flex;
    list-style: none;
    z-index: 10;
    &-item {
      width: 8px;
      height: 8px;
      margin: 12px 5px;
      border-radius: 50%;
      background: $grey;
      cursor: pointer;
      &--active {
        background: $theme-color;
      }
    }
  }
}
.ay-arrow-left-enter,
.ay-arrow-left-leave-active {
  transform: translateY(-50%) translateX(-10px);
  opacity: 0;
}
.ay-arrow-right-enter,
.ay-arrow-right-leave-active {
  transform: translateY(-50%) translateX(10px);
  opacity: 0;
}
</style>
