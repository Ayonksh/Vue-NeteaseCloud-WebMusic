<template>
  <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: "AySvgIcon",
  props: {
    icon: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.icon}`;
    },
    svgClass() {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    },
  },
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
