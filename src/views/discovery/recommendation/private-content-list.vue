<template>
  <ay-loading :loading="loading">
    <ul class="list-wrap">
      <li
        @click="toDetail(content.id)"
        class="list-item"
        v-for="content in privatecontent"
        :key="content.id"
      >
        <private-content-card
          :imgUrl="content.picUrl"
          :footer="content.name"
        ></private-content-card>
      </li>
    </ul>
  </ay-loading>
</template>

<script>
import { getPersonalPrivateContent } from "@/api";
import { AyLoading } from "@/base";
import { PrivateContentCard } from "@/components";
export default {
  name: "PrivateContentList",
  components: {
    AyLoading,
    PrivateContentCard,
  },
  data() {
    return {
      privatecontent: [],
      loading: false,
    };
  },
  created() {
    this.initPrivateContent();
  },
  methods: {
    async initPrivateContent() {
      this.loading = true;
      const { result } = await getPersonalPrivateContent();
      this.privatecontent = result;
      this.loading = false;
    },
    toDetail(id) {
      if (id) {
        this.$router.push({ name: "MvDetail", params: { id } });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@include list(33.3%);
</style>
