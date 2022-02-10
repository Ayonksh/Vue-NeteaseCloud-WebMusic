<template>
  <div>
    <ay-loading class="loader-wrap" :loading="loading">
      <ay-carousel>
        <ay-carousel-item v-for="banner in banners" :key="banner.imageUrl">
          <div class="banner">
            <img
              class="banner-img"
              v-lazy="getImgUrl(banner.imageUrl, 1000, 400)"
            />
            <div
              class="banner-title"
              :style="{ 'background-color': banner.titleColor }"
            >
              {{ banner.typeTitle }}
            </div>
          </div>
        </ay-carousel-item>
      </ay-carousel>
    </ay-loading>
    <div class="card-wrap">
      <ay-card :shadow="'hover'">
        <template slot="header">
          <span class="card-title" @click="toMorePage('SongList')">
            推荐歌单 >
          </span>
        </template>
        <recommend-song-list></recommend-song-list>
      </ay-card>
    </div>
    <div class="card-wrap">
      <ay-card :shadow="'hover'">
        <template slot="header">
          <span class="card-title" @click="toMorePage('PrivateContent')">
            独家放送 >
          </span>
        </template>
        <private-content-list></private-content-list>
      </ay-card>
    </div>
    <div class="card-wrap">
      <ay-card :shadow="'hover'">
        <template slot="header">
          <span class="card-title" @click="toMorePage('NewMusic')">
            最新音乐 >
          </span>
        </template>
        <div class="card-content">
          <new-song-list></new-song-list>
        </div>
      </ay-card>
    </div>
    <div class="card-wrap">
      <ay-card :shadow="'hover'">
        <template slot="header">
          <span class="card-title" @click="toMorePage('AllMv')">推荐MV ></span>
        </template>
        <recommend-mv-list></recommend-mv-list>
      </ay-card>
    </div>
    <div class="card-wrap">
      <ay-card :shadow="'hover'">
        <template slot="header">
          <span class="card-title">主播电台</span>
        </template>
        <radio-station-list></radio-station-list>
      </ay-card>
    </div>
  </div>
</template>

<script>
import { getBanner } from "@/api";
import { AyCarousel, AyCarouselItem, AyCard, AyLoading } from "@/base";
import { getImgUrl } from "@/utils";
import NewSongList from "./new-song-list";
import PrivateContentList from "./private-content-list";
import RadioStationList from "./radio-station-list";
import RecommendMvList from "./recommend-mv-list";
import RecommendSongList from "./recommend-song-list";

export default {
  name: "Recommendation",
  components: {
    AyCarousel,
    AyCarouselItem,
    AyCard,
    AyLoading,
    NewSongList,
    PrivateContentList,
    RadioStationList,
    RecommendMvList,
    RecommendSongList,
  },
  data() {
    return {
      banners: [],
      loading: false,
    };
  },
  created() {
    this.initBanner();
  },
  methods: {
    getImgUrl,
    async initBanner() {
      this.loading = true;
      const { banners } = await getBanner();
      this.banners = banners;
      this.loading = false;
    },
    toMorePage(name) {
      this.$router.push({ name });
    },
  },
};
</script>

<style lang="scss" scoped>
.loader-wrap {
  margin-bottom: 40px;
  .banner {
    position: fixed; // 固定 banner-title
    .banner-img {
      width: 100%;
      max-width: 500px;
      height: 100%;
      border-radius: 10px;
    }
    .banner-title {
      position: absolute;
      padding: 4px 10px;
      right: 0;
      bottom: 4px;
      border-radius: 10px 0 10px 0;
      color: $white;
      font-size: $font-size;
      font-weight: 400;
      text-align: center;
    }
  }
}
.card-wrap {
  margin: 30px 0;
  .card-title {
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
  }
  @include list(16.6%);
  .card-content {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .wrap {
      flex-grow: 1;
      margin: 8px 4px;
    }
  }
}
</style>
