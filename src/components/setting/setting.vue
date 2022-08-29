<template>
  <div class="setting">
    <ay-svg-icon class="icon" icon="settings" />
  </div>
</template>

<script>
export default {
  name: "Setting",
  methods: {},
};
</script>

<style lang="scss" scoped>
.setting {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .icon {
    font-size: 24px;
    cursor: pointer;
  }
}
</style>
