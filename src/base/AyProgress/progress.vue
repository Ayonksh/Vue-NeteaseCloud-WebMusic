<template>
  <div class="ay-progress">
    <div
      class="ay-progress-bar"
      :style="{ width: barWidth, height: barHeight }"
      v-if="type === 'line'"
      ref="bar"
      @click="handleClick"
    >
      <div
        class="ay-progress-bar__inner"
        :class="
          barMode === 'horizontal'
            ? 'ay-progress-bar__inner--horizontal'
            : 'ay-progress-bar__inner--vertical'
        "
        :style="barInnerStyle"
      ></div>
      <div
        class="ay-progress-bar__btn"
        :style="barBtnStyle"
        v-if="!disable"
        ref="btn"
        @mousedown="onMousedown"
      ></div>
    </div>
    <div class="ay-progress-circle" :style="circleStyle" v-else>
      <svg :viewBox="viewBox">
        <path
          :d="trackPath"
          stroke="#e5e9f2"
          :stroke-width="strokeWidth_"
          fill="none"
          :style="trailPathStyle"
        ></path>
        <path
          id="svg-path"
          :d="trackPath"
          :stroke="stroke"
          :stroke-width="percentage ? strokeWidth_ : 0"
          :stroke-linecap="strokeLinecap"
          fill="none"
          :style="circlePathStyle"
        ></path>
        <circle
          id="svg-btn"
          cx="0"
          cy="0"
          :r="strokeWidth_"
          :fill="stroke"
          v-if="!disable"
        ></circle>
      </svg>
    </div>
    <div
      class="ay-progress-text"
      :style="textStyle"
      v-if="showProgress"
      ref="text"
    >
      <template>{{ content }}</template>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

import { on, off } from "@/utils/dom";

export default {
  name: "AyProgress",
  model: {
    prop: "percentage",
    event: "percentageChange",
  },
  props: {
    // 当前进度，值为 0 - 100
    percentage: Number,
    // 种类
    type: {
      type: String,
      default: "line",
      validator: (value) => ["line", "circle", "dashboard"].indexOf(value) > -1,
    },
    // 是否允许调整进度
    disable: Boolean,
    // 颜色
    color: {
      type: [String, Array, Function],
      default: "",
    },
    // 是否显示进度
    showProgress: {
      type: Boolean,
      default: true,
    },
    // 指定进度内容
    format: Function,

    // 当 type 为 line 的时候
    // 进度条的方向
    barMode: {
      type: String,
      default: "horizontal",
      validator: (value) => ["horizontal", "vertical"].indexOf(value) > -1,
    },
    // 进度条宽度
    barWidth: {
      type: String,
      default: "500px",
    },
    // 进度条高度
    barHeight: {
      type: String,
      default: "4px",
    },
    // 进度条的小球大小计算系数
    coefficient: {
      type: Number,
      default: 2,
    },

    // 当 type 为 circle 或者 dashboard 的时候
    // 进度环的半径
    radius: {
      type: String,
      default: "50px",
    },
    // 进度环的线条宽度
    strokeWidth: {
      type: String,
      default: "4px",
    },
    // 进度环的线条路径两端的形状
    strokeLinecap: {
      type: String,
      default: "round",
      validator: (value) => ["butt", "round", "square"].indexOf(value) > -1,
    },
  },
  data() {
    return {
      barWidth_: Number(this.barWidth.split("px")[0]),
      barHeight_: Number(this.barHeight.split("px")[0]),
      movingStartX: 0,
      movingStartY: 0,
      moving: false,
      svgPercentage: this.percentage,
      radius_: Number(this.radius.split("px")[0]),
      strokeWidth_: Number(this.strokeWidth.split("px")[0]),
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.type === "line" && this.barMode === "vertical") {
        this.reflow();
        on(document, "mouseup", this.stopMove);
      } else if (this.type !== "line") {
        this.setSvgBtn();
      }
    });
  },
  computed: {
    barInnerStyle() {
      if (this.barMode === "horizontal") {
        return {
          width: `${(this.percentage / 100) * this.barWidth_}px`,
          backgroundColor: this.stroke,
        };
      } else {
        return {
          height: `${(this.percentage / 100) * this.barHeight_}px`,
          backgroundColor: this.stroke,
        };
      }
    },
    barBtnStyle() {
      const { btnPos, btnWidth } = this;
      if (this.barMode === "horizontal") {
        return {
          width: `${btnWidth}px`,
          height: `${btnWidth}px`,
          left: btnPos,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: this.stroke,
        };
      } else {
        return {
          width: `${btnWidth}px`,
          height: `${btnWidth}px`,
          // left: "50%",
          // transform: "translateX(-50%)",
          left: `calc(50% - ${btnWidth / 2}px)`, // 也可以用 calc 定位
          bottom: btnPos,
          backgroundColor: this.stroke,
        };
      }
    },
    btnPos() {
      const { btnWidth } = this;
      if (this.barMode === "horizontal") {
        const currentPos =
          (this.percentage / 100) * this.barWidth_ - btnWidth / 2;
        return `${currentPos}px`;
      } else {
        const currentPos =
          (this.percentage / 100) * this.barHeight_ - btnWidth / 2;
        return `${currentPos}px`;
      }
    },
    btnWidth() {
      if (this.barMode === "horizontal") {
        return this.barHeight_ * this.coefficient;
      } else {
        return this.barWidth_ * this.coefficient;
      }
    },
    groundWidth() {
      return this.radius_ * 2 + this.strokeWidth_ / 2 + 10; // 加 10 是为了增大画布宽高
    },
    circleStyle() {
      return {
        width: this.groundWidth + "px",
        height: this.groundWidth + "px",
      };
    },
    viewBox() {
      return `0 0 ${this.groundWidth} ${this.groundWidth}`;
    },
    trackPath() {
      const radius = this.radius_;
      const centerPos = this.groundWidth / 2;
      const isDashboard = this.type === "dashboard";
      const startX = centerPos;
      const startY = isDashboard ? centerPos + radius : centerPos - radius;
      return `
          M ${startX} ${startY}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? "-" : ""}${radius * 2}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? "" : "-"}${radius * 2}
          `;
    },
    perimeter() {
      return 2 * Math.PI * this.radius_;
    },
    rate() {
      return this.type === "dashboard" ? 0.75 : 1;
    },
    strokeDashoffset() {
      const offset = (-1 * this.perimeter * (1 - this.rate)) / 2;
      return offset;
    },
    trailPathStyle() {
      return {
        strokeDasharray: `${this.perimeter * this.rate}px, ${this.perimeter}px`,
        strokeDashoffset: `${this.strokeDashoffset}px`,
      };
    },
    circlePathStyle() {
      return {
        strokeDasharray: `${
          this.perimeter * this.rate * (this.percentage / 100)
        }px, ${this.perimeter}px`,
        strokeDashoffset: `${this.strokeDashoffset}px`,
        // transition: "stroke-dasharray 0.6s ease 0s, stroke 0.6s ease",
      };
    },
    status() {
      if (this.percentage >= 75) {
        return "success";
      } else if (this.percentage >= 50 && this.percentage < 75) {
        return "inspiring";
      } else if (this.percentage >= 25 && this.percentage < 50) {
        return "warning";
      } else {
        return "danger";
      }
    },
    stroke() {
      let ret;
      if (this.color) {
        ret = this.getCurrentColor(this.percentage);
      } else {
        switch (this.status) {
          case "success":
            ret = "#13ce66";
            break;
          case "inspiring":
            ret = "#409eff";
            break;
          case "warning":
            ret = "#e6a23c";
            break;
          case "danger":
            ret = "#f56c6c";
        }
      }
      return ret;
    },
    textStyle() {
      const style = {};
      style.fontSize = this.progressTextSize + "px";
      style.color = this.stroke;
      if (this.type === "line") {
        if (this.barMode === "horizontal") {
          style.marginLeft = "10px";
        } else {
          style.marginBottom = "5px";
        }
      } else {
        style.width = this.groundWidth + "px";
        style.position = "absolute";
        style.left = 0;
        style.top = "50%";
        style.transform = "translateY(-50%)";
      }
      return style;
    },
    progressTextSize() {
      if (this.type === "line") {
        if (this.barMode === "horizontal") {
          return 12 + this.barHeight_ * 0.1;
        } else {
          return 12 + this.barWidth_ * 0.1;
        }
      } else {
        return this.groundWidth * 0.1 + 2;
      }
    },
    content() {
      if (typeof this.format === "function") {
        return this.format(this.percentage) || "";
      } else {
        return `${this.percentage.toFixed(1)}%`;
      }
    },
  },
  watch: {
    svgPercentage(newVal) {
      this.$emit("percentageChange", newVal);
      this.$emit("moving");
    },
  },
  methods: {
    reflow() {
      let node = this.$refs.text;
      let refNode = this.$refs.bar;
      this.$el.insertBefore(node, refNode);

      this.$el.style.display = "flex";
      this.$el.style.justifyContent = "center";
      this.$el.style.alignItems = "center";
      this.$el.style.flexDirection = "column";
    },
    setSvgBtn() {
      if (this.disable) return;

      let data = this.$data; // 使用浅拷贝来修改 this.$data.svgPercentage
      let rate = this.rate;
      let strokeDashoffset = this.strokeDashoffset;
      let btn = document.querySelector("#svg-btn");
      let path = document.querySelector("#svg-path");
      let pathLength = path.getTotalLength() || 0;
      let startPosition =
        pathLength * rate * (data.svgPercentage / 100) - strokeDashoffset;
      let startPoint = path.getPointAtLength(startPosition);

      gsap.set(btn, {
        transformOrigin: "center",
        x: startPoint.x,
        y: startPoint.y,
      });
      Draggable.create(btn, {
        liveSnap: {
          points: pointModifier,
        },
      });
      function pointModifier(point) {
        let p = closestPoint(path, pathLength, point);
        return p.point;
      }
      function closestPoint(pathNode, pathLength, point) {
        // point 是鼠标移动时的坐标点
        // console.log(point);
        // 圆弧上距离鼠标最近的点为 min，这个点距离 path 的起始点：弧长为 minLength，直线距离为 minDistance
        let precision = 8,
          min,
          minLength,
          minDistance = Infinity;

        // linear scan for coarse approximation
        for (
          let scan, scanLength = 0, scanDistance;
          scanLength <= pathLength;
          scanLength += precision
        ) {
          if (
            (scanDistance = distance2(
              (scan = pathNode.getPointAtLength(scanLength))
            )) < minDistance
          ) {
            (min = scan),
              (minLength = scanLength),
              (minDistance = scanDistance);
          }
        }
        // binary search for precise estimate
        precision /= 2;
        while (precision > 0.5) {
          let before,
            after,
            beforeLength,
            afterLength,
            beforeDistance,
            afterDistance;
          if (
            (beforeLength = minLength - precision) >= 0 &&
            (beforeDistance = distance2(
              (before = pathNode.getPointAtLength(beforeLength))
            )) < minDistance
          ) {
            (min = before),
              (minLength = beforeLength),
              (minDistance = beforeDistance);
          } else if (
            (afterLength = minLength + precision) <= pathLength &&
            (afterDistance = distance2(
              (after = pathNode.getPointAtLength(afterLength))
            )) < minDistance
          ) {
            (min = after),
              (minLength = afterLength),
              (minDistance = afterDistance);
          } else {
            precision /= 2;
          }
        }

        updatePercentage(minLength);

        return {
          point: min,
          length: minLength,
          distance: Math.sqrt(minDistance),
        };

        function distance2(p) {
          let dx = p.x - point.x,
            dy = p.y - point.y;
          return dx * dx + dy * dy;
        }
      }

      function updatePercentage(distance) {
        if (distance < -strokeDashoffset) {
          data.svgPercentage = 0;
        } else if (distance > pathLength + strokeDashoffset) {
          data.svgPercentage = 100;
        } else {
          data.svgPercentage =
            ((distance + strokeDashoffset) /
              (pathLength + 2 * strokeDashoffset)) *
            100;
        }
      }
    },
    formatPercentage(percentage) {
      return Math.max(Math.min(percentage, 100), 0);
    },
    handleClick(e) {
      if (this.disable) return;
      // 点击小球时跳过
      if (e.target === this.$refs.btn) {
        return;
      }
      let percent;
      if (this.barMode === "horizontal") {
        percent = this.formatPercentage((e.offsetX / this.barWidth_) * 100);
      } else {
        percent = this.formatPercentage(
          ((this.barHeight_ - e.offsetY) / this.barHeight_) * 100
        );
      }
      this.$emit("percentageChange", percent);
      this.$emit("bar-click", percent);
    },
    onMousedown(e) {
      if (this.disable) return;
      this.moving = true;
      const btn = this.$refs.btn;
      if (this.barMode === "horizontal") {
        this.movingStartX = e.clientX - btn.offsetLeft;
      } else {
        this.movingStartY = e.clientY - btn.offsetTop;
      }
      on(document, "mousemove", this.onMousemove);
    },
    onMousemove(e) {
      if (this.disable) return;
      if (this.moving) {
        let percent;
        if (this.barMode === "horizontal") {
          percent = this.formatPercentage(
            ((e.clientX - this.movingStartX) / this.barWidth_) * 100
          );
        } else {
          percent = this.formatPercentage(
            ((this.barHeight_ - (e.clientY - this.movingStartY)) /
              this.barHeight_) *
              100
          );
        }
        this.$emit("percentageChange", percent);
        this.$emit("moving");
      }
    },
    stopMove() {
      this.moving = false;
      this.$emit("moving-stop");
      off(document, "mousemove", this.onMousemove);
    },
    getCurrentColor(percentage) {
      if (typeof this.color === "string") {
        return this.color;
      } else if (typeof this.color === "function") {
        return this.color(percentage);
      } else {
        return this.getLevelColor(percentage);
      }
    },
    getLevelColor(percentage) {
      const colorArray = this.getColorArray().sort(
        (a, b) => a.percentage - b.percentage
      );

      for (let i = 0; i < colorArray.length; i++) {
        if (colorArray[i].percentage > percentage) {
          return colorArray[i].color;
        }
      }
      return colorArray[colorArray.length - 1].color;
    },
    getColorArray() {
      const color = this.color;
      const span = 100 / color.length;
      return color.map((seriesColor, index) => {
        if (typeof seriesColor === "string") {
          return {
            color: seriesColor,
            percentage: (index + 1) * span,
          };
        }
        return seriesColor;
      });
    },
  },
  beforeDestroy() {
    off(document, "mouseup", this.stopMove);
    off(document, "mousemove", this.onMousemove);
  },
};
</script>

<style lang="scss" scoped>
.ay-progress {
  position: relative;
  .ay-progress-bar {
    background-color: $grey;
    border-radius: 5px;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    &__inner {
      border-radius: 5px;
      position: absolute;
      &--horizontal {
        height: inherit;
        left: 0;
      }
      &--vertical {
        width: inherit;
        bottom: 0;
      }
    }
    &__btn {
      border-radius: 50%;
      position: absolute;
      cursor: grab;
    }
  }
  .ay-progress-text {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
  }
}
</style>
