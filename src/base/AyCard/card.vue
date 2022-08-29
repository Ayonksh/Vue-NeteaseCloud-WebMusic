<template>
  <div class="ay-card" :class="`is-${shadow}-shadow`" :style="wrapStyle">
    <div
      class="ay-card__header"
      :style="headerStyle"
      v-if="$slots.header || header"
    >
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="ay-card__content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "AyCard",
  props: {
    header: String,
    shadow: {
      type: String,
      default: "hover",
      validator: (value) => ["always", "never", "hover"].indexOf(value) > -1,
    },
    wrapStyle: {
      default: () => {
        return {};
      },
      type: Object,
    },
    headerStyle: {
      default: () => {
        return {};
      },
      type: Object,
    },
    contentStyle: {
      default: () => {
        return {};
      },
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.ay-card {
  transition: 0.3s;
  border-radius: 10px;
  &__header {
    padding: 10px 20px;
    border-bottom: 1px solid $grey;
  }
  &__content {
    padding: 20px;
  }
}
.is-never-shadow {
  box-shadow: none;
}
.is-always-shadow {
  @include box-shadow;
}
.is-hover-shadow {
  &:hover {
    @include box-shadow;
  }
}
</style>
