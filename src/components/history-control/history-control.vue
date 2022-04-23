<template>
  <div class="history-control">
    <div class="img-wrap" @click="back">
      <img :src="require('@/assets/head/arrow-left-bold.png')" />
    </div>
    <div class="img-wrap" @click="forward">
      <img :src="require('@/assets/head/arrow-right-bold.png')" />
    </div>
  </div>
</template>

<script>
export default {
  name: "HistoryControl",
  methods: {
    back() {
      this.$router.back();
    },
    forward() {
      this.$router.forward();
    },
  },
};
</script>

<style lang="scss" scoped>
.history-control {
  height: 100%;
  display: flex;
  align-items: center;
  .img-wrap {
    margin: 0 5px;
    @include circle(24px);
    background-color: $grey-light;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.4s;
    cursor: pointer;
    opacity: 0.4;
    img {
      height: 16px;
      width: 16px;
    }
    &:hover {
      opacity: 1;
    }
  }
}
</style>
