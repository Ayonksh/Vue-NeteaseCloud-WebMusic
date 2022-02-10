<template>
  <div class="mvs-wrap">
    <ay-card :shadow="'never'">
      <ay-loading :loading="loading">
        <ul class="list-wrap">
          <li
            class="list-item"
            v-for="mv in mvs"
            :key="mv.id"
            @click="toDetail(mv.id)"
          >
            <mv-card
              :imgUrl="mv.imgurl"
              :name="mv.name"
              :count="formatNumber(mv.playCount).toString()"
            ></mv-card>
          </li>
        </ul>
      </ay-loading>
    </ay-card>
  </div>
</template>

<script>
import { getArtistMv } from "@/api";
import { AyCard, AyLoading } from "@/base";
import { MvCard } from "@/components";
import { formatNumber } from "@/utils";
export default {
  name: "SingerMvs",
  components: { MvCard, AyCard, AyLoading },
  props: ["id"],
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
      const id = this.id;
      const { mvs } = await getArtistMv({ id, limit: 1000 });
      this.mvs = mvs;
      this.loading = false;
    },
    toDetail(id) {
      this.$router.push({ name: "MvDetail", params: { id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.mvs-wrap {
  @include list(25%);
}
</style>
