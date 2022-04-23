<template>
  <div class="setting">
    <div class="img-wrap">
      <img :src="require('@/assets/head/setting.png')" />
    </div>
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
  align-items: center;
  .img-wrap {
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
