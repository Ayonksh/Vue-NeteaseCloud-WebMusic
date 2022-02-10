<template>
  <li class="ay-menu-item-group">
    <div class="ay-menu-item-group__title">{{ title }}</div>
    <ul>
      <slot></slot>
    </ul>
  </li>
</template>

<script>
export default {
  name: "AyMenuItemGroup",
  provide: function () {
    return {
      menuItemGroup: this,
    };
  },
  inject: ["rootMenu"],
  props: {
    title: {
      type: String,
      default: "group-title",
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.ay-menu-item-group {
  &__title {
    height: $menu-title-height;
    padding: 0 12px;
    line-height: $menu-title-height;
    font-size: $font-size-sm;
    color: $menu-title-color;
  }
}
</style>
