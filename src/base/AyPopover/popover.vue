<template>
  <div class="ay-popover">
    <transition name="ay-fade-in">
      <div
        v-if="initPopover"
        v-show="showPopover"
        class="ay-popover__body"
        :class="`ay-popover__body--${placement}`"
        :style="[popoverStyle, customStyle]"
        ref="popover"
      >
        <slot name="content"></slot>
        <div
          :class="['ay-popover__arrow', `ay-popover__arrow--${placement}`]"
          ref="arrow"
        ></div>
      </div>
    </transition>
    <div class="ay-popover__trigger" ref="trigger">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { on, off } from "@/utils/dom";

export default {
  name: "AyPopover",
  props: {
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
      validator: (value) =>
        /^(top|bottom|left|right)(-start|-end)?$/g.test(value) != false,
    },
    width: {
      type: String,
      default: "150px",
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
    customStyle: Object,
  },
  data() {
    return {
      initPopover: false,
      showPopover: false,
    };
  },
  mounted() {
    let { trigger } = this.$refs;
    switch (this.trigger) {
      case "click": {
        on(trigger, "click", this.doToggle);
        on(document, "click", this.handleDocumentClick);
        break;
      }
      case "hover": {
        on(trigger, "mouseenter", this.handleMouseEnter);
        on(trigger, "mouseleave", this.handleMouseLeave);
        break;
      }
      case "manual": {
        on(trigger, "click", this.doToggle);
        break;
      }
    }
  },
  computed: {
    popoverStyle() {
      const { width } = this;
      return {
        width: width,
      };
    },
  },
  watch: {
    initPopover() {
      this.$nextTick(this.createPopover);
    },
    showPopover(val) {
      val ? this.$emit("show") : this.$emit("hide");
      this.$nextTick(this.setPopoverPosition);
    },
  },
  methods: {
    createPopover() {
      let { popover } = this.$refs;
      if (this.trigger === "hover") {
        on(popover, "mouseenter", this.handleMouseEnter);
        on(popover, "mouseleave", this.handleMouseLeave);
      }
      document.body.appendChild(popover);
      this.setPopoverPosition();
    },
    setPopoverPosition() {
      let { popover, trigger, arrow } = this.$refs;
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
      if (this.initPopover == false) {
        this.initPopover = true;
        this.showPopover = true;
      } else {
        this.showPopover = !this.showPopover;
      }
    },
    doOpen() {
      this.showPopover = true;
    },
    doClose() {
      this.showPopover = false;
    },
    handleMouseEnter() {
      clearTimeout(this._timer);
      this.initPopover = true;
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
      let { trigger } = this.$refs;
      if (
        !this.$el ||
        this.$el.contains(e.target) ||
        !trigger ||
        trigger.contains(e.target)
      )
        return;
      this.showPopover = false;
    },
    destroyPopover() {
      let { trigger, popover } = this.$refs;
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
        case "manual": {
          off(trigger, "click", this.doToggle);
          break;
        }
      }
      if (document.body.contains(popover)) {
        document.body.removeChild(popover);
      }
    },
  },
  // call destroy in keep-alive mode
  deactivated() {
    this.destroyPopover();
  },
};
</script>

<style lang="scss" scoped>
.ay-popover {
  position: relative;
  .ay-popover__trigger {
    cursor: pointer;
  }
}
.ay-popover__body {
  position: absolute;
  padding: 6px;
  border: 1px solid $grey;
  border-radius: 10px;
  background-color: $white;
  @include box-shadow;
  z-index: $popover-index;
  .ay-popover__arrow {
    width: 0;
    height: 0;
    border: 6px solid transparent;
    position: absolute;
    &--top {
      bottom: -6px;
      border-bottom: 0;
      border-top-color: $white;
    }
    &--top-start {
      bottom: -6px;
      border-bottom: 0;
      border-top-color: $white;
    }
    &--top-end {
      bottom: -6px;
      border-bottom: 0;
      border-top-color: $white;
    }
    &--right {
      left: -6px;
      border-left: 0;
      border-right-color: $white;
    }
    &--right-start {
      left: -6px;
      border-left: 0;
      border-right-color: $white;
    }
    &--right-end {
      left: -6px;
      border-left: 0;
      border-right-color: $white;
    }
    &--bottom {
      top: -6px;
      border-top: 0;
      border-bottom-color: $white;
    }
    &--bottom-start {
      top: -6px;
      border-top: 0;
      border-bottom-color: $white;
    }
    &--bottom-end {
      top: -6px;
      border-top: 0;
      border-bottom-color: $white;
    }
    &--left {
      right: -6px;
      border-right: 0;
      border-left-color: $white;
    }
    &--left-start {
      right: -6px;
      border-right: 0;
      border-left-color: $white;
    }
    &--left-end {
      right: -6px;
      border-right: 0;
      border-left-color: $white;
    }
  }
  &--top {
    margin-bottom: 6px;
  }
  &--top-start {
    margin-bottom: 6px;
  }
  &--top-end {
    margin-bottom: 6px;
  }
  &--right {
    margin-left: 6px;
  }
  &--right-start {
    margin-left: 6px;
  }
  &--right-end {
    margin-left: 6px;
  }
  &--bottom {
    margin-top: 6px;
  }
  &--bottom-start {
    margin-top: 6px;
  }
  &--bottom-end {
    margin-top: 6px;
  }
  &--left {
    margin-right: 6px;
  }
  &--left-start {
    margin-right: 6px;
  }
  &--left-end {
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
.ay-fade-in-enter-active,
.ay-fade-in-leave-active {
  transition: opacity 0.3s linear;
}
.ay-fade-in-enter,
.ay-fade-in-leave-to,
.ay-fade-in-leave-active {
  opacity: 0;
}
</style>
