<template>
  <ul class="ay-menu">
    <slot></slot>
  </ul>
</template>

<script>
export default {
  name: "AyMenu",
  provide: function () {
    return {
      rootMenu: this,
    };
  },
  props: {
    mode: {
      type: String,
      default: "vertical",
      validator: (value) => ["vertical", "horizontal"].indexOf(value) > -1,
    },
    defaultActive: {
      type: String,
      default: "",
    },
    trigger: {
      type: String,
      default: "click",
      validator: (value) => ["hover", "click"].indexOf(value) > -1,
    },
  },
  data() {
    return {
      activeIndex: this.defaultActive,
      openedMenus: [],
      menuItems: {},
      subMenus: {},
    };
  },
  watch: {
    activeIndex(index) {
      this.$emit("activeIndex", index);
    },
  },
  methods: {
    updateActiveIndex(val) {
      this.activeIndex = val;
    },
    // 初始化 menuItems  在 menuItem 组件 mounted 阶段调用
    setItems(key, menuItem) {
      this.menuItems[key] = menuItem;
      menuItem.$on("activeIndexChange", this.updateActiveIndex);
    },
    // 初始化 subMenus  在 subMenu 组件 mounted 阶段调用
    setSubMenus(key, subMenu) {
      this.subMenus[key] = subMenu;
    },
  },
};
</script>

<style lang="scss" scoped>
.ay-menu {
  overflow-y: auto;
}
</style>
