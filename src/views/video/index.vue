<template>
  <div class="tabs-wrap">
    <ay-tab v-model="activeName">
      <ay-tab-pane label="视频" name="video">
        <video-list></video-list>
      </ay-tab-pane>
      <ay-tab-pane label="MV" name="mv">
        <mv-list></mv-list>
      </ay-tab-pane>
    </ay-tab>
  </div>
</template>

<script>
import { AyTab, AyTabPane } from "@/base";
import MvList from "./mv/mv-list";
import VideoList from "./video/video-list";
export default {
  name: "Video",
  components: {
    AyTab,
    AyTabPane,
    MvList,
    VideoList,
  },
  data() {
    return {
      activeName: "mv",
    };
  },
  mounted() {},
  methods: {},
  computed: {},
  watch: {},
};
</script>

<style lang="scss" scoped>
.tabs-wrap {
  padding: 16px 56px;
}
</style>
