<template>
  <div class="albums-wrap">
    <ay-card :shadow="'never'">
      <ay-loading :loading="loading">
        <ul class="list-wrap">
          <li class="list-item" v-for="alb in albums" :key="alb.id">
            <album-card
              :imgUrl="alb.picUrl"
              :name="alb.name"
              :artistName="formatDateTime(alb.publishTime)"
              @click="handleGetSong(alb.id)"
            ></album-card>
          </li>
        </ul>
      </ay-loading>
    </ay-card>
  </div>
</template>

<script>
import { getAlbumDetail } from "@/api";
import { AyCard, AyLoading } from "@/base";
import { AlbumCard } from "@/components";
import { formatDateTime, formatSong, musicMixin } from "@/utils";
export default {
  name: "SingerAlbums",
  mixins: [musicMixin],
  components: { AyCard, AyLoading, AlbumCard },
  props: ["albums", "loading"],
  methods: {
    formatDateTime,
    async handleGetSong(id) {
      this.setPlaylistLoading(true);
      const { songs } = await getAlbumDetail({ id });
      const playlist = [];
      songs.map((song) => {
        playlist.push(
          formatSong({
            id: song.id,
            name: song.name,
            artists: song.ar,
            duration: song.dt,
            mvId: song.mv,
            img: song.al.picUrl,
            albumId: song.al.id,
            albumName: song.al.name,
          })
        );
      });
      this.setPlaylist(playlist);
      this.setCurrentSong(playlist[0]);
      this.setPlaylistLoading(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.albums-wrap {
  @include list(14.2%);
}
</style>
