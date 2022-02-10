<template>
  <div
    class="progress-bar"
    :style="{ height: `${barHeight}px`, width: `${barWidth}px` }"
    @mousedown="handleClick"
    ref="bar"
  >
    <div
      class="current"
      :class="mode === 'horizontal' ? 'current-horizontal' : 'current-vertical'"
      :style="curStyle"
    ></div>
    <div
      v-show="!disable"
      :style="btnStyle"
      @mousedown="onMousedown"
      ref="btn"
    ></div>
  </div>
</template>

<script>
import { on, off } from "@/utils/dom";
export default {
  name: "AyProgressBar",
  model: {
    prop: "percentage",
    event: "percentageChange",
  },
  props: {
    // 是否允许调整进度
    disable: Boolean,
    // v-model 当前进度 值为 0 ~ 1
    percentage: Number,
    // 高度
    barHeight: {
      type: Number,
      default: 4,
    },
    barWidth: {
      type: Number,
      default: 500,
    },
    mode: {
      type: String,
      default: "horizontal",
      validator: (value) => ["horizontal", "vertical"].indexOf(value) > -1,
    },
    // 颜色
    color: {
      type: String,
      default: "#d33a31",
    },
    // 小球大小计算系数
    coefficient: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      startX: 0,
      startY: 0,
      move: false,
    };
  },
  computed: {
    curStyle() {
      if (this.mode === "horizontal") {
        return {
          width: `${this.percentage * this.barWidth}px`,
          backgroundColor: this.color,
          borderRadius: "5px",
        };
      } else {
        return {
          height: `${this.percentage * this.barHeight}px`,
          backgroundColor: this.color,
          borderRadius: "5px",
        };
      }
    },
    btnStyle() {
      const { btnStart, btnWidth } = this;
      if (this.mode === "horizontal") {
        return {
          position: "absolute",
          left: btnStart,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: this.color,
          width: `${btnWidth}px`,
          height: `${btnWidth}px`,
          borderRadius: "50%",
          cursor: "pointer",
        };
      } else {
        return {
          position: "absolute",
          bottom: btnStart,
          // left: "50%",
          // transform: "translateX(-50%)",
          left: `calc(50% - ${btnWidth / 2}px)`, // 也可以用 calc 定位
          backgroundColor: this.color,
          width: `${btnWidth}px`,
          height: `${btnWidth}px`,
          borderRadius: "50%",
          cursor: "pointer",
        };
      }
    },
    btnStart() {
      const { btnWidth } = this;
      if (this.mode === "horizontal") {
        const currentPos = this.percentage * this.barWidth - btnWidth / 2;
        return `${currentPos}px`;
      } else {
        const currentPos = this.percentage * this.barHeight - btnWidth / 2;
        return `${currentPos}px`;
      }
    },
    btnWidth() {
      if (this.mode === "horizontal") {
        return this.barHeight * this.coefficient;
      } else {
        return this.barWidth * this.coefficient;
      }
    },
  },
  watch: {
    move(move) {
      if (!move) this.$emit("move-stop");
    },
  },
  mounted() {
    on(document, "mouseup", this.stopMove);
  },
  methods: {
    formatPercentage(percentage) {
      return Math.max(Math.min(percentage, 1), 0);
    },
    handleClick(e) {
      if (this.disable) return;
      // 点击小球时跳过
      if (e.target === this.$refs.btn) {
        return;
      }
      if (this.mode === "horizontal") {
        const percent = this.formatPercentage(e.offsetX / this.barWidth);
        this.$emit("percentageChange", percent);
        this.$emit("bar-click", percent);
      } else {
        const percent = this.formatPercentage(
          (this.barHeight - e.offsetY) / this.barHeight
        );
        this.$emit("percentageChange", percent);
        this.$emit("bar-click", percent);
      }
    },
    onMousedown(e) {
      if (this.disable) return;
      this.move = true;
      const btn = this.$refs.btn;
      if (this.mode === "horizontal") {
        this.startX = e.clientX - btn.offsetLeft;
      } else {
        this.startY = e.clientY - btn.offsetTop;
      }
      on(document, "mousemove", this.onMousemove);
    },
    onMousemove(e) {
      if (this.disable) return;
      if (this.move) {
        if (this.mode === "horizontal") {
          const percent = this.formatPercentage(
            (e.clientX - this.startX) / this.barWidth
          );
          this.$emit("percentageChange", percent);
        } else {
          const percent = this.formatPercentage(
            (this.barHeight - (e.clientY - this.startY)) / this.barHeight
          );
          this.$emit("percentageChange", percent);
        }
        this.$emit("moving");
      }
    },
    stopMove() {
      this.move = false;
    },
  },
  beforeDestroy() {
    off(document, "mousemove", this.onMousemove);
    off(document, "mouseup", this.stopMove);
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  width: 100%;
  background-color: $grey;
  border-radius: 5px;
  position: relative;
  cursor: pointer;
  .current {
    &-horizontal {
      height: inherit;
    }
    &-vertical {
      width: inherit;
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
