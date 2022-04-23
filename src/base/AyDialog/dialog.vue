<template>
  <transition name="fade">
    <div class="ay-dialog-wrap" v-if="visible">
      <transition name="dialog">
        <div class="ay-dialog" v-show="visible" :style="dialogStyle">
          <div class="header-wrap">
            <slot name="header">
              <div>{{ title }}</div>
            </slot>
            <div class="close-wrap" @click.stop="closeDialog">
              <img :src="require('@/assets/icon/close-2.png')" />
            </div>
          </div>
          <div class="body-wrap">
            <slot></slot>
          </div>
          <div class="footer-wrap">
            <slot name="footer"></slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AyDialog",
  model: {
    prop: "visible",
    event: "visibleChange",
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    width: {
      type: String,
      default: "50%",
    },
    title: {
      type: String,
      default: "",
    },
    handleClose: Function,
  },
  data() {
    return {};
  },
  computed: {
    dialogStyle() {
      const { width } = this;
      return {
        width,
      };
    },
  },
  methods: {
    closeDialog() {
      this.handleClose
        ? this.handleClose()
        : this.$emit("visibleChange", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.ay-dialog-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2050;
  .ay-dialog {
    background: #fff;
    border-radius: 10px;
    @include box-shadow(0, 1px, 3px, 0);
    .header-wrap {
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      .close-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        img {
          width: 20px;
          height: 20px;
        }
      }
    }
    .body-wrap {
      padding: 15px 30px;
    }
    .footer-wrap {
      padding: 15px 30px;
    }
  }
}
</style>
