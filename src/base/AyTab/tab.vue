<template>
  <div class="ay-tab">
    <div class="ay-tab__header">
      <ay-tab-nav @navClick="handleClick">
        <slot name="header"></slot>
      </ay-tab-nav>
    </div>
    <div class="ay-tab__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import AyTabNav from "./tabNav";
export default {
  name: "AyTab",
  components: { AyTabNav },
  provide: function () {
    return {
      root: this,
    };
  },
  model: {
    prop: "activeName",
    event: "activeChange",
  },
  props: {
    activeColor: String,
    activeName: {
      type: String,
    },
    center: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentName: this.activeName,
      panes: [],
    };
  },
  watch: {
    currentName(currentName) {
      this.$emit("activeChange", currentName);
    },
    activeName(activeName) {
      this.currentName = activeName;
    },
  },
  methods: {
    set(currentName) {
      this.currentName = currentName;
    },
    setPanes(pane) {
      this.panes.push(pane);
    },
    handleClick(data) {
      this.$emit("tabClick", data);
    },
  },
};
</script>

<style lang="scss" scoped></style>
