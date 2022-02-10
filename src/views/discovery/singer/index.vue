<template>
  <div class="singer-page-wrap">
    <div>
      <tag-list
        :active="true"
        :defaultActive="LANGUAGES[0]"
        :title="'语种：'"
        :tags="LANGUAGES"
        @tagChange="onLanguageTagChange"
      ></tag-list>
      <tag-list
        :active="true"
        :defaultActive="SINGERTYPE[0]"
        :title="'分类：'"
        :tags="SINGERTYPE"
        @tagChange="onTypeTagChange"
      ></tag-list>
      <tag-list
        :active="true"
        :defaultActive="INITIALS[0]"
        :title="'筛选：'"
        :tags="INITIALS"
        @tagChange="onInitialsTagChange"
      ></tag-list>
    </div>
    <ul class="list-wrap">
      <li class="list-item" v-for="(singer, index) in singerList" :key="index">
        <singer-card
          :id="singer.id"
          :imgUrl="singer.picUrl"
          :name="singer.name"
        ></singer-card>
      </li>
    </ul>
    <ay-loading :loading="loading"></ay-loading>
  </div>
</template>

<script>
import { getArtistList } from "@/api";
import { AyLoading } from "@/base";
import { LANGUAGES, SINGERTYPE, INITIALS } from "@/config";
import { TagList, SingerCard } from "@/components";
import { on, off } from "@/utils";
const OFFSET_VAL = 0;
export default {
  name: "Singer",
  components: { AyLoading, TagList, SingerCard },
  data() {
    return {
      LANGUAGES,
      SINGERTYPE,
      INITIALS,
      params: {
        limit: 50,
        offset: OFFSET_VAL,
        area: -1,
        type: -1,
        initial: "-1",
      },
      page: OFFSET_VAL + 1,
      singerList: [],
      scrollToBottom: 0,
      more: true,
      loading: false,
      contentEl: document.getElementById("content__ref"),
    };
  },
  created() {
    this.initArtistList(this.params);
  },
  mounted() {
    on(this.contentEl, "scroll", this.scrollAction);
  },
  watch: {
    params: {
      handler(params) {
        this.initArtistList(params);
      },
      deep: true,
    },
    scrollToBottom(val) {
      if (val < 500 && !this.loading) {
        this.page++;
        this.params.offset = (this.page - 1) * this.params.limit;
      }
    },
  },
  methods: {
    onLanguageTagChange(tag) {
      this.resetStatus();
      this.params.area = tag.value;
    },
    onTypeTagChange(tag) {
      this.resetStatus();
      this.params.type = tag.value;
    },
    onInitialsTagChange(tag) {
      this.resetStatus();
      this.params.initial = tag.value || tag.name;
    },
    async initArtistList(params) {
      if (this.more && !this.loading) {
        this.loading = true;
        const { artists, more } = await getArtistList(params);
        this.more = more;
        this.singerList.push(...artists);
        this.loading = false;
      }
    },
    resetStatus() {
      this.singerList = [];
      this.params.offset = OFFSET_VAL;
      this.more = true;
    },
    scrollAction() {
      let scrollTop = this.contentEl.scrollTop;
      let scrollHeight = this.contentEl.scrollHeight;
      let clientHeight = this.contentEl.clientHeight;
      // 滚动条距离底部的距离
      this.scrollToBottom = scrollHeight - scrollTop - clientHeight;
    },
  },
  destroyed() {
    off(this.contentEl, "scroll", this.scrollAction);
  },
};
</script>

<style lang="scss" scoped>
.singer-page-wrap {
  @include list(20%);
}
</style>
