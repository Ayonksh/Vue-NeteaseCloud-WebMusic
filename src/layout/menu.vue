<template>
  <div class="menu-wrap">
    <ay-menu :defaultActive="defaultActive" @activeIndex="handleRouteChange">
      <ay-menu-item-group title="推荐">
        <ay-menu-item index="Recommendation">发现音乐</ay-menu-item>
        <ay-menu-item index="Podcast">播客</ay-menu-item>
        <ay-menu-item index="Video">视频</ay-menu-item>
        <ay-menu-item index="Fm">私人FM</ay-menu-item>
      </ay-menu-item-group>
      <ay-sub-menu title="创建的歌单" index="/" v-if="userPlaylist.length">
        <ay-menu-item
          v-for="item in userPlaylist"
          :key="item.id"
          :index="item.id.toString()"
        >
          {{ item.name }}
        </ay-menu-item>
      </ay-sub-menu>
    </ay-menu>
  </div>
</template>

<script>
const ROUTE_LIST = ["Recommendation", "Podcast", "Fm", "Video"];
import { AyMenu, AyMenuItem, AySubMenu, AyMenuItemGroup } from "@/base";
import { userMixin } from "@/utils";
export default {
  name: "LayoutMenu",
  mixins: [userMixin],
  components: { AyMenu, AyMenuItem, AySubMenu, AyMenuItemGroup },
  data() {
    return {
      defaultActive: this.$route.name,
    };
  },
  methods: {
    handleRouteChange(name) {
      if (ROUTE_LIST.includes(name)) {
        this.$router.push({ name });
      } else {
        this.$router.push({ name: "SongListDetail", params: { id: name } });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-wrap {
  height: 100%;
  width: 15%;
  min-width: 150px;
  max-width: $menu-width;
  background-color: $menu-bg;
}
</style>
