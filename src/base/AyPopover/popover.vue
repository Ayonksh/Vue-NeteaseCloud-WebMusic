<template>
  <div class="ay-popover-wrap">
    <transition name="fade">
      <div
        ref="popover"
        class="ay-popover"
        :class="`ay-popover__${placement}`"
        :style="wrapStyle"
        v-show="showPopover || (show && isManual)"
      >
        <div class="ay-popover-content">
          <slot name="content"></slot>
          <div
            ref="arrow"
            :class="['ay-popover-arrow', `ay-popover-arrow__${placement}`]"
          ></div>
        </div>
      </div>
    </transition>
    <div class="trigger" ref="trigger">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { on, off } from "@/utils/dom";
const positionList = [
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
  "right",
  "right-start",
  "right-end",
];

export default {
  name: "AyPopover",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    wrapStyle: Object,
    // 触发方式
    trigger: {
      type: String,
      default: "click",
      validator: (value) => ["click", "hover", "manual"].indexOf(value) > -1,
    },
    // 出现位置
    placement: {
      type: String,
      default: "bottom",
      validator: (value) => positionList.indexOf(value) > -1,
    },
    // 打开延迟
    openDelay: {
      type: Number,
      default: 0,
    },
    // 关闭延迟
    closeDelay: {
      type: Number,
      default: 400,
    },
  },
  data() {
    return {
      showPopover: false,
    };
  },
  mounted() {
    if (!this.isManual) this.createPopover();
  },
  computed: {
    isManual() {
      return this.trigger === "manual";
    },
  },
  watch: {
    show(show) {
      if (show && this.isManual) this.$nextTick(() => this.placementContent());
    },
  },
  methods: {
    createPopover() {
      let { popover, trigger } = this.$refs;
      if (!popover) return;
      this.placementContent();
      switch (this.trigger) {
        case "click": {
          on(trigger, "click", this.doToggle);
          on(document, "click", this.handleDocumentClick);
          break;
        }
        case "hover": {
          on(trigger, "mouseenter", this.handleMouseEnter);
          on(popover, "mouseenter", this.handleMouseEnter);
          on(trigger, "mouseleave", this.handleMouseLeave);
          on(popover, "mouseleave", this.handleMouseLeave);
          break;
        }
      }
    },
    placementContent() {
      const { popover, trigger, arrow } = this.$refs;
      document.body.appendChild(popover);
      const {
        width: triggerWidth,
        height: triggerHeight,
        left: triggerLeft,
        top: triggerTop,
      } = trigger.getBoundingClientRect();
      const { width: contentWidth, height: contentHeight } =
        popover.getBoundingClientRect();
      const fixed = 10;
      let style = {};
      switch (this.placement) {
        case "top":
          {
            style = {
              left:
                window.scrollX +
                triggerLeft +
                triggerWidth / 2 -
                contentWidth / 2,
              top: window.scrollY + triggerTop - contentHeight - fixed,
            };
            arrow.style.left = "calc(50% - 6px)";
          }
          break;
        case "top-start":
          {
            style = {
              left: window.scrollX + triggerLeft,
              top: window.scrollY + triggerTop - contentHeight - fixed,
            };
            let pecentage = (triggerWidth / 2 / contentWidth) * 100 + "%";
            arrow.style.left = `calc(${pecentage} - 6px)`;
          }
          break;
        case "top-end":
          {
            style = {
              left: window.scrollX + triggerLeft + triggerWidth - contentWidth,
              top: window.scrollY + triggerTop - contentHeight - fixed,
            };
            let pecentage = (triggerWidth / 2 / contentWidth) * 100 + "%";
            arrow.style.right = `calc(${pecentage} - 6px)`;
          }
          break;
        case "bottom":
          {
            style = {
              left:
                window.scrollX +
                triggerLeft +
                triggerWidth / 2 -
                contentWidth / 2,
              top: window.scrollY + triggerHeight + triggerTop,
            };
            arrow.style.left = "calc(50% - 6px)";
          }
          break;
        case "bottom-start":
          {
            style = {
              left: window.scrollX + triggerLeft,
              top: window.scrollY + triggerHeight + triggerTop,
            };
            let pecentage = (triggerWidth / 2 / contentWidth) * 100 + "%";
            arrow.style.left = `calc(${pecentage} - 6px)`;
          }
          break;
        case "bottom-end":
          {
            style = {
              left: window.scrollX + triggerLeft + triggerWidth - contentWidth,
              top: window.scrollY + triggerHeight + triggerTop,
            };
            let pecentage = (triggerWidth / 2 / contentWidth) * 100 + "%";
            arrow.style.right = `calc(${pecentage} - 6px)`;
          }
          break;
        case "left":
          {
            style = {
              left: window.scrollX + triggerLeft - contentWidth - fixed,
              top:
                window.scrollY +
                triggerTop +
                triggerHeight / 2 -
                contentHeight / 2,
            };
            arrow.style.top = "calc(50% - 6px)";
          }
          break;
        case "left-start":
          {
            style = {
              left: window.scrollX + triggerLeft - contentWidth - fixed,
              top: window.scrollY + triggerTop,
            };
            let pecentage = (triggerHeight / 2 / contentHeight) * 100 + "%";
            arrow.style.top = `calc(${pecentage} - 6px)`;
          }
          break;
        case "left-end":
          {
            style = {
              left: window.scrollX + triggerLeft - contentWidth - fixed,
              top: window.scrollY + triggerTop + triggerHeight - contentHeight,
            };
            let pecentage = (triggerHeight / 2 / contentHeight) * 100 + "%";
            arrow.style.bottom = `calc(${pecentage} - 6px)`;
          }
          break;
        case "right":
          {
            style = {
              left: window.scrollX + triggerLeft + triggerWidth,
              top:
                window.scrollY +
                triggerTop +
                triggerHeight / 2 -
                contentHeight / 2,
            };
            arrow.style.top = "calc(50% - 6px)";
          }
          break;
        case "right-start":
          {
            style = {
              left: window.scrollX + triggerLeft + triggerWidth,
              top: window.scrollY + triggerTop,
            };
            let pecentage = (triggerHeight / 2 / contentHeight) * 100 + "%";
            arrow.style.top = `calc(${pecentage} - 6px)`;
          }
          break;
        case "right-end":
          {
            style = {
              left: window.scrollX + triggerLeft + triggerWidth,
              top: window.scrollY + triggerTop + triggerHeight - contentHeight,
            };
            let pecentage = (triggerHeight / 2 / contentHeight) * 100 + "%";
            arrow.style.bottom = `calc(${pecentage} - 6px)`;
          }
          break;
      }
      popover.style.left = `${style.left}px`;
      popover.style.top = `${style.top}px`;
    },
    doToggle() {
      this.showPopover ? this.doClose() : this.doOpen();
    },
    doOpen() {
      this.showPopover = true;
      this.$nextTick(this.createPopover);
    },
    doClose() {
      this.showPopover = false;
    },
    handleMouseEnter() {
      clearTimeout(this._timer);
      if (this.openDelay) {
        this._timer = setTimeout(() => {
          this.doOpen();
        }, this.openDelay);
      } else {
        this.doOpen();
      }
    },
    handleMouseLeave() {
      clearTimeout(this._timer);
      if (this.closeDelay) {
        this._timer = setTimeout(() => {
          this.doClose();
        }, this.closeDelay);
      } else {
        this.doClose();
      }
    },
    handleDocumentClick(e) {
      let { popover, trigger } = this.$refs;
      if (
        !this.$el ||
        !trigger ||
        this.$el.contains(e.target) ||
        trigger.contains(e.target) ||
        !popover ||
        popover.contains(e.target)
      )
        return;
      this.showpopover = false;
    },
    destroyPopover() {
      const { trigger, popover } = this.$refs;
      switch (this.trigger) {
        case "click": {
          off(trigger, "click", this.doToggle);
          off(document, "click", this.handleDocumentClick);
          break;
        }
        case "hover": {
          off(trigger, "mouseenter", this.handleMouseEnter);
          off(popover, "mouseenter", this.handleMouseEnter);
          off(trigger, "mouseleave", this.handleMouseLeave);
          off(popover, "mouseleave", this.handleMouseLeave);
          break;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ay-popover-wrap {
  position: relative;
  .trigger {
    cursor: pointer;
  }
}
.ay-popover {
  position: absolute;
  padding: 6px;
  border: 1px solid $grey;
  border-radius: 10px;
  background-color: $white;
  @include box-shadow;
  z-index: $popover-index;
  .ay-popover-content {
    .ay-popover-arrow {
      width: 0;
      height: 0;
      border: 6px solid transparent;
      position: absolute;
      &__top {
        bottom: -6px;
        border-bottom: 0;
        border-top-color: $white;
      }
      &__top-start {
        bottom: -6px;
        border-bottom: 0;
        border-top-color: $white;
      }
      &__top-end {
        bottom: -6px;
        border-bottom: 0;
        border-top-color: $white;
      }
      &__right {
        left: -6px;
        border-left: 0;
        border-right-color: $white;
      }
      &__right-start {
        left: -6px;
        border-left: 0;
        border-right-color: $white;
      }
      &__right-end {
        left: -6px;
        border-left: 0;
        border-right-color: $white;
      }
      &__bottom {
        top: -6px;
        border-top: 0;
        border-bottom-color: $white;
      }
      &__bottom-start {
        top: -6px;
        border-top: 0;
        border-bottom-color: $white;
      }
      &__bottom-end {
        top: -6px;
        border-top: 0;
        border-bottom-color: $white;
      }
      &__left {
        right: -6px;
        border-right: 0;
        border-left-color: $white;
      }
      &__left-start {
        right: -6px;
        border-right: 0;
        border-left-color: $white;
      }
      &__left-end {
        right: -6px;
        border-right: 0;
        border-left-color: $white;
      }
    }
  }
  &__top {
    margin-bottom: 6px;
  }
  &__top-start {
    margin-bottom: 6px;
  }
  &__top-end {
    margin-bottom: 6px;
  }
  &__right {
    margin-left: 6px;
  }
  &__right-start {
    margin-left: 6px;
  }
  &__right-end {
    margin-left: 6px;
  }
  &__bottom {
    margin-top: 6px;
  }
  &__bottom-start {
    margin-top: 6px;
  }
  &__bottom-end {
    margin-top: 6px;
  }
  &__left {
    margin-right: 6px;
  }
  &__left-start {
    margin-right: 6px;
  }
  &__left-end {
    margin-right: 6px;
  }
  ::-webkit-scrollbar {
    background-color: $white;
    width: 4px;
    height: 4px;
    background-clip: padding-box;
  }

  /* 滚动条中间滑动部分 */
  ::-webkit-scrollbar-thumb {
    background-color: $theme-color;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-button {
    background-color: $white;
  }
}
</style>
