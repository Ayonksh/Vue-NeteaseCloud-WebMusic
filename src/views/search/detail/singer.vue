<template>
  <div class="singer-wrap">
    <ay-loading :loading="loading">
      <ul class="list">
        <li
          class="item"
          @click="toDetail(singer.id)"
          v-for="singer in data"
          :key="singer.id"
        >
          <div class="base">
            <img class="cover" v-lazy="getImgUrl(singer.picUrl, 90, 90)" />
            <div class="name">
              <span v-html="brightenKeyword(singer.name, `${keywords}`)"></span>
            </div>
          </div>
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
  name: "SingerResult",
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
  mounted() {
    this.$nextTick(this.getData);
  },
  methods: {
    getImgUrl,
    brightenKeyword,
    getArtistsText,
    toDetail(id) {
      this.$router.push({ name: "SingerDetail", params: { id } });
    },
    async getData() {
      this.data = [];
      this.loading = true;
      const { keywords, type, offset, limit } = this;
      const {
        result: { artistCount, artists },
      } = await getSearchData({
        keywords,
        type,
        offset,
        limit,
      });
      this.data = artists;
      this.count = artistCount;
      this.$emit("count", artistCount);
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.singer-wrap {
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
