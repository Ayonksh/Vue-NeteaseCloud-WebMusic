<template>
  <ay-loading :loading="loading">
    <ul class="list-wrap">
      <li class="list-item" v-for="program in djProgram" :key="program.id">
        <radio-station-card
          :imgUrl="program.picUrl"
          :title="program.copywriter"
          :footer="program.name"
          :id="program.id"
        ></radio-station-card>
      </li>
    </ul>
  </ay-loading>
</template>

<script>
import { getPersonalDjProgram } from "@/api";
import { AyLoading } from "@/base";
import { RadioStationCard } from "@/components";
export default {
  name: "RadioStationList",
  components: {
    AyLoading,
    RadioStationCard,
  },
  data() {
    return {
      loading: false,
      djProgram: [],
    };
  },
  created() {
    this.initDjProgram();
  },
  methods: {
    async initDjProgram() {
      this.loading = true;
      const { result } = await getPersonalDjProgram();
      this.djProgram = result;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@include list(16.6%);
</style>
