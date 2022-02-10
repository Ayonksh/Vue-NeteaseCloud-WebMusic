<template>
  <div class="github">
    <div class="img-wrap">
      <img :src="require('@/assets/head/github.png')" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Github",
  methods: {},
};
</script>

<style lang="scss" scoped>
.github {
  height: $header-height;
  display: flex;
  align-items: center;
  .img-wrap {
    display: flex;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
