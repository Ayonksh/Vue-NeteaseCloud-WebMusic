<template>
  <div
    v-show="ready"
    class="ay-carousel__item"
    :style="itemStyle"
    @click="handleItemClick"
  >
    <div
      v-if="$parent.type === 'card'"
      v-show="!active"
      class="ay-carousel__item-mask"
    ></div>
    <slot></slot>
  </div>
</template>

<script>
const CARD_SCALE = 0.83;
export default {
  name: "AyCarouselItem",
  data() {
    return {
      ready: false,
      active: false,
      inStage: false,
      translate: 0,
      scale: 1,
    };
  },
  created() {
    this.$parent && this.$parent.updateItems();
  },
  computed: {
    itemStyle() {
      let zIndex = 0;
      if (this.active) {
        zIndex = 4;
      } else if (this.inStage) {
        zIndex = 3;
      } else {
        zIndex = 0;
      }
      const style = {
        width: this.$parent.type === "card" ? "50%" : "100%",
        transform: `translateX(${this.translate}px) scale(${this.scale})`,
        cursor:
          this.$parent.type === "card"
            ? this.inStage
              ? "pointer"
              : "default"
            : "",
        zIndex,
      };
      return style;
    },
  },
  methods: {
    processIndex(index, activeIndex, length) {
      if (activeIndex === 0 && index === length - 1) {
        return -1;
      } else if (activeIndex === length - 1 && index === 0) {
        return length;
      } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
        return length + 1;
      } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
        return -2;
      }
      return index;
    },
    calcCardTranslate(index, activeIndex) {
      const parentWidth = this.$parent.$el.offsetWidth;
      if (this.inStage) {
        return (
          (parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1)) / 4
        );
      } else if (index < activeIndex) {
        return (-(1 + CARD_SCALE) * parentWidth) / 4;
      } else {
        return ((3 + CARD_SCALE) * parentWidth) / 4;
      }
    },
    calcTranslate(index, activeIndex) {
      const distance = this.$parent.$el.offsetWidth;
      return distance * (index - activeIndex);
    },
    translateItem(index, activeIndex) {
      const parentType = this.$parent.type;
      const length = this.$parent.items.length;
      if (index !== activeIndex && length > 2) {
        index = this.processIndex(index, activeIndex, length);
      }
      if (parentType === "card") {
        this.active = index === activeIndex;
        this.inStage = Math.round(Math.abs(index - activeIndex)) <= 1;
        this.translate = this.calcCardTranslate(index, activeIndex);
        this.scale = this.active ? 1 : CARD_SCALE;
      } else {
        this.active = index === activeIndex;
        this.translate = this.calcTranslate(index, activeIndex);
        this.scale = 1;
      }
      this.ready = true;
    },
    handleItemClick() {
      const parent = this.$parent;
      if (parent && parent.type === "card") {
        const index = parent.items.indexOf(this);
        parent.setActiveIndex(index);
        parent.resetTimer();
      }
    },
  },
  destroyed() {
    this.$parent && this.$parent.updateItems();
  },
};
</script>

<style lang="scss" scoped>
.ay-carousel__item {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: transform 0.5s ease-in-out;
  z-index: 0;
  &-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $white;
    opacity: 0.24;
    transition: transform 0.4s ease-in-out;
  }
}
</style>
