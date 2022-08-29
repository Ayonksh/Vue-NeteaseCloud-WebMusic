<template>
  <div class="github">
    <ay-svg-icon class="icon" icon="github" @click.stop="openGithub" />
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
  justify-content: center;
  align-items: center;
  .icon {
    font-size: 24px;
    cursor: pointer;
  }
}
</style>
