<template>
  <transition name="ay-notification-fade">
    <div
      :class="['ay-notification', `ay-notification--${horizontalClass}`]"
      :style="positiveStyle"
      v-if="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <div class="ay-notification__header">
        <h1 class="ay-notification__title">{{ title }}</h1>
        <ay-svg-icon class="close" icon="close" @click.stop="handleClose" />
      </div>
      <div class="ay-notification__content" v-if="message">
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AyNotification",
  data() {
    return {
      visible: false,
      title: "",
      message: "",
      duration: 4000,
      position: "top-right",
      verticalOffset: 0,
      closed: false,
      onClose: () => {},
      timer: null,
    };
  },
  computed: {
    horizontalClass() {
      return this.position.indexOf("right") > -1 ? "right" : "left";
    },
    verticalProperty() {
      return /^top-/.test(this.position) ? "top" : "bottom";
    },
    positiveStyle() {
      return {
        [this.verticalProperty]: `${this.verticalOffset}px`,
      };
    },
  },
  mounted() {
    this.startTimer();
    document.addEventListener("keydown", this.keydown);
  },
  methods: {
    handleClose() {
      this.onClose();
      this.visible = false;
      this.closed = true;
    },
    clearTimer() {
      clearTimeout(this.timer);
    },
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.handleClose();
          }
        }, this.duration);
      }
    },
    keydown(e) {
      if (e.keyCode === 46 || e.keyCode === 8) {
        this.clearTimer(); // detele 取消倒计时
      } else if (e.keyCode === 27) {
        // esc关闭消息
        if (!this.closed) {
          this.handleClose();
        }
      } else {
        this.startTimer(); // 恢复倒计时
      }
    },
    beforeDestroy() {
      document.removeEventListener("keydown", this.keydown);
    },
  },
};
</script>

<style lang="scss" scoped>
.ay-notification {
  width: 250px;
  padding: 14px 20px;
  border-radius: 10px;
  background-color: $white;
  font-size: $font-size;
  transition: 0.8s;
  overflow: hidden;
  z-index: $notification-index;
  position: fixed;
  @include box-shadow;
  &--left {
    left: 16px;
  }
  &--right {
    right: 16px;
  }
  .ay-notification__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ay-notification__title {
      width: 80%;
      font-size: 18px;
      font-weight: bold;
      @include text-ellipsis;
    }
    .close {
      font-size: 16px;
      cursor: pointer;
    }
  }
  .ay-notification__content {
    margin-top: 12px;
    font-size: 15px;
    font-weight: 500;
  }
}
</style>
