<template>
  <div class="singer-list-wrap">
    <div class="header">
      <h1 class="title">云音乐歌手榜</h1>
      <div class="time" v-if="updateTime">
        更新时间：{{ formatDateTime(updateTime) }}
      </div>
    </div>
    <div class="tabs-wrap">
      <ay-tab v-model="activeName" :center="false" :activeColor="'#909399'">
        <ay-tab-pane
          :label="tab.label"
          :name="tab.name"
          v-for="tab in TabsData"
          :key="tab.name"
        >
          <ay-loading :loading="loading">
            <ul class="list">
              <li
                class="item"
                v-for="(artist, idx) in artists[activeName]"
                :key="artist.id"
                @click="toDetail(artist.id)"
              >
                <div class="idx-wrap">
                  <div class="idx">{{ idx + 1 }}</div>
                  <div class="last-rank">
                    {{ getRankText(idx, artist.lastRank) }}
                  </div>
                </div>
                <div class="img-wrap">
                  <img v-lazy="getImgUrl(artist.picUrl, 64)" />
                </div>
                <div class="name">{{ artist.name }}</div>
                <div class="alias" v-if="artist.alias.length">
                  ({{ getAliasText(artist.alias) }})
                </div>
              </li>
            </ul>
          </ay-loading>
        </ay-tab-pane>
      </ay-tab>
    </div>
  </div>
</template>

<script>
const TabsData = [
  {
    label: "华语",
    name: "1",
  },
  {
    label: "欧美",
    name: "2",
  },
  {
    label: "韩国",
    name: "3",
  },
  {
    label: "日本",
    name: "4",
  },
];
import { getArtistTopList } from "@/api";
import { AyTab, AyTabPane, AyLoading } from "@/base";
import { formatDateTime, getImgUrl, isDefined } from "@/utils";
export default {
  name: "SingerListDetail",
  components: {
    AyTab,
    AyTabPane,
    AyLoading,
  },
  data() {
    return {
      TabsData,
      artists: {},
      loading: false,
      activeName: TabsData[0].name,
      updateTime: 0,
    };
  },
  created() {
    this.getArtistsList();
  },
  watch: {
    activeName() {
      this.getArtistsList();
    },
    id() {
      this.getArtistsList();
    },
  },
  methods: {
    getImgUrl,
    formatDateTime,
    getRankText(rank, lastRank) {
      if (!isDefined(lastRank)) {
        return "new";
      }
      const txt = rank - lastRank;
      if (txt == 0) return "-0";
      return txt > 0 ? `↑${txt}` : `↓${txt}`;
    },
    getAliasText(alias) {
      return (alias || []).join("、");
    },
    async getArtistsList() {
      const { activeName } = this;
      const { list } = await getArtistTopList({ type: activeName });
      const { artists, updateTime } = list;
      this.artists[activeName] = artists;
      this.updateTime = updateTime;
      this.loading = false;
    },
    toDetail(id) {
      this.$router.push({ name: "SingerDetail", params: { id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.singer-list-wrap {
  .header {
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title {
      font-size: 32px;
      margin-bottom: 12px;
    }
    .time {
      color: $grey-dark;
    }
  }
  .list {
    .item {
      transition: cubic-bezier(0.075, 0.82, 0.165, 1) 0.3s;
      display: flex;
      align-items: center;
      height: 64px;
      cursor: pointer;
      .idx-wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        opacity: 0.8;
        margin: 0 32px;
        .idx {
          font-weight: bold;
          font-size: 20px;
        }
        .last-rank {
          font-size: $font-size-sm;
        }
      }
      .img-wrap {
        height: 48px;
        width: 48px;
        position: relative;
        margin: 0 24px;
        img {
          height: 100%;
          width: 100%;
          @include abs-center;
        }
      }
      .alias {
        color: $grey-dark;
      }
      &:nth-child(even) {
        background-color: $grey-light;
      }
      &:hover {
        background-color: $grey;
      }
    }
  }
}
</style>
