<template>
  <li class="ay-submenu">
    <div class="ay-submenu__title" @click="onSubMenuClick">
      {{ title }}
      <img
        :class="['icon', isOpen ? 'reverse' : '']"
        :src="require('@/assets/icon/arrow-down-red.png')"
      />
    </div>
    <transition name="fade">
      <ul v-show="isOpen">
        <slot></slot>
      </ul>
    </transition>
  </li>
</template>

<script>
export default {
  name: "ay-sub-menu",
  provide: function () {
    return {
      subMenu: this,
    };
  },
  inject: ["rootMenu"],
  props: {
    title: {
      type: String,
      default: "title",
      require: true,
    },
    index: {
      type: String,
      default: "",
      require: true,
    },
  },
  data() {
    return {
      isOpen: true,
    };
  },
  mounted() {
    this.rootMenu.setSubMenus(this.index, this);
  },
  methods: {
    onSubMenuClick() {
      this.isOpen ? this.doSubMenuClose() : this.doSubMenuOpen();
    },
    doSubMenuOpen() {
      this.isOpen = true;
    },
    doSubMenuClose() {
      this.isOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.ay-submenu {
  height: auto;
  transition: all 0.3s;
  &__title {
    cursor: pointer;
    position: relative;
    padding: 0 12px;
    height: $menu-title-height;
    line-height: $menu-title-height;
    font-size: $font-size;
    color: $menu-title-color;
  }
  .icon {
    position: absolute;
    top: 50%;
    right: 24px;
    transition: 0.3s;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
  }
  .reverse {
    transform: translateY(-50%) rotate(180deg);
  }
}
</style>
