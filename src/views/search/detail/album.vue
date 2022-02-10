<template>
  <div class="album-wrap">
    <ay-loading :loading="loading">
      <ul class="list">
        <li
          class="item"
          @click="toDetail(album.id)"
          v-for="album in data"
          :key="album.id"
        >
          <div class="base">
            <img class="cover" v-lazy="getImgUrl(album.picUrl, 90, 90)" />
            <div class="name">
              <span v-html="brightenKeyword(album.name, `${keywords}`)"></span>
              <span class="alias" v-if="album.alias.length"
                >({{ album.alias.join(",") }})
              </span>
            </div>
          </div>
          <div class="creator">by {{ getArtistsText(album.artists) }}</div>
        </li>
      </ul>
    </ay-loading>
    <div class="pagination-wrap">
      <ay-pagination
        v-model="current"
        :limit="limit"
        :total="count"
      ></ay-pagination>
    </div>
  </div>
</template>

<script>
import { getSearchData } from "@/api";
import { AyLoading, AyPagination } from "@/base";
import { getImgUrl, brightenKeyword, getArtistsText } from "@/utils";
export default {
  name: "AlbumResult",
  props: ["keywords", "type"],
  components: { AyLoading, AyPagination },
  data() {
    return {
      current: 1,
      limit: 30,
      data: [],
      count: 0,
      loading: false,
    };
  },
  computed: {
    offset() {
      return this.limit * (this.current - 1);
    },
  },
  watch: {
    current() {
      this.getData();
    },
    keywords() {
      this.current = 1;
      this.getData();
    },
  },
  methods: {
    getImgUrl,
    brightenKeyword,
    getArtistsText,
    toDetail(id) {
      this.$router.push({ name: "AlbumDetail", params: { id } });
    },
    async getData() {
      this.data = [];
      this.loading = true;
      const { keywords, type, offset, limit } = this;
      const {
        result: { albumCount, albums },
      } = await getSearchData({
        keywords,
        type,
        offset,
        limit,
      });
      this.data = albums;
      this.count = albumCount;
      this.$emit("count", albumCount);
      this.loading = false;
    },
  },
  mounted() {
    this.$nextTick(this.getData);
  },
};
</script>

<style lang="scss" scoped>
.album-wrap {
  .list {
    min-height: 300px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      transition: 0.3s;
      cursor: pointer;
      font-size: $font-size-sm;
      .base {
        display: flex;
        align-items: center;
        width: 30%;
        .cover {
          width: 42px;
          height: 42px;
          margin-right: 16px;
        }
        .name {
          .alias {
            color: $grey-dark;
          }
        }
      }
      .creator {
        width: 50%;
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
  .pagination-wrap {
    float: right;
    margin: 24px 0;
  }
}
</style>
