<template>
  <ay-loading :loading="loading">
    <div class="desc-wrap">
      <div class="section">
        <h2 class="title">{{ name }}简介</h2>
        <div class="content">
          {{ desc.briefDesc }}
        </div>
      </div>
      <div class="section" v-for="(intro, idx) in desc.introduction" :key="idx">
        <h2 class="title">{{ intro.ti }}</h2>
        <div class="content">
          <p v-for="txt in intro.txt.split('\n')" :key="txt">{{ txt }}</p>
        </div>
      </div>
    </div>
  </ay-loading>
</template>

<script>
import { getArtistDesc } from "@/api";
import { AyLoading } from "@/base";
export default {
  name: "SingerDescription",
  props: {
    name: String,
    id: String,
  },
  components: { AyLoading },
  data() {
    return {
      desc: {},
      loading: false,
    };
  },
  created() {
    this.initDesc();
  },
  methods: {
    async initDesc() {
      this.loading = true;
      const { id } = this;
      this.desc = await getArtistDesc({ id });
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.desc-wrap {
  padding: 0 56px;
  .section {
    margin: 20px 0;
    .title {
      margin: 10px 0;
    }
    .content {
      text-indent: 2em;
      color: $grey-dark;
      line-height: 1.6;
    }
  }
}
</style>
