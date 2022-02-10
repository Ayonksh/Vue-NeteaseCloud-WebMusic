<template>
  <ay-loading :loading="loading">
    <ul class="list-wrap">
      <li
        class="list-item"
        v-for="mv in mvs"
        :key="mv.id"
        @click="toDetail(mv.id)"
      >
        <mv-card
          :imgUrl="mv.picUrl"
          :count="formatNumber(mv.playCount).toString()"
          :desc="mv.copywriter"
          :name="mv.name"
          :artistName="mv.artistName"
        ></mv-card>
      </li>
    </ul>
  </ay-loading>
</template>

<script>
import { getPersonalMv } from "@/api";
import { AyLoading } from "@/base";
import { MvCard } from "@/components";
import { formatNumber } from "@/utils";
export default {
  name: "RecommendMvList",
  components: {
    AyLoading,
    MvCard,
  },
  data() {
    return {
      mvs: [],
      loading: false,
    };
  },
  created() {
    this.initMv();
  },
  methods: {
    formatNumber,
    async initMv() {
      this.loading = true;
      const { result } = await getPersonalMv();
      this.mvs = result;
      this.loading = false;
    },
    toDetail(id) {
      this.$router.push({ name: "MvDetail", params: { id } });
    },
  },
};
</script>

<style lang="scss" scoped>
@include list(25%);
</style>
