<template>
  <div class="github">
    <div class="img-wrap" @click="openGithub()">
      <img :src="require('@/assets/head/github.png')" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Github",
  methods: {
    openGithub() {
      window.open("https://github.com/Ayonveig/Vue-NeteaseCloud-WebMusic");
    },
  },
};
</script>

<style lang="scss" scoped>
.github {
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
