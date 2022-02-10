<template>
  <div class="tabs-wrap">
    <ay-tab v-model="activeName" @tabClick="onTabClick">
      <ay-tab-pane
        v-for="tab in tabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
      >
        <router-view :key="true"></router-view>
      </ay-tab-pane>
    </ay-tab>
  </div>
</template>

<script>
const tabs = [
  { label: "个性推荐", name: "Recommendation" },
  { label: "歌单", name: "SongList" },
  { label: "排行榜", name: "Rank" },
  { label: "歌手", name: "Singer" },
  { label: "最新音乐", name: "NewMusic" },
];
import { AyTab, AyTabPane } from "@/base";
export default {
  name: "Discovery",
  data() {
    return {
      activeName: this.$route.name,
      tabs,
    };
  },
  components: { AyTab, AyTabPane },
  watch: {
    $route(to) {
      this.activeName = to.name;
    },
  },
  methods: {
    onTabClick(name) {
      this.$router.push({ name });
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs-wrap {
  margin: 0 auto;
  padding: 15px 60px;
  max-width: 1300px;
}
</style>
