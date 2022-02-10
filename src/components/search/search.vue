<template>
  <ay-popover
    class="popover"
    :show="show"
    :wrapStyle="{ width: '360px', margin: '0' }"
    trigger="manual"
    placement="bottom"
  >
    <ay-input
      class="input"
      v-model="keywords"
      size="sm"
      :wrapStyle="{ borderRadius: '15px' }"
      :placeholder="showKeyword"
      @focus="handleFocus"
      @blur="handleBlur"
      @keyup.enter.native="handleSearch()"
    >
      <template slot="prefix">
        <div class="img-wrap" @click="handleSearch()">
          <img :src="require('@/assets/search/search.png')" />
        </div>
      </template>
    </ay-input>
    <template slot="content">
      <div class="data-list">
        <div class="suggest-list" v-if="showSuggest">
          <div class="title">
            <span
              v-html="brightenKeyword(`搜索“${keywords}”的相关结果>`, keywords)"
            ></span>
          </div>
          <ul class="detail-list" v-if="suggest.songs">
            <li class="list-title">
              <img
                class="list-icon"
                :src="require('@/assets/search/music.png')"
              />单曲
            </li>
            <li
              class="list-item"
              v-for="song in suggest.songs"
              :key="song.id"
              @click="handleSetCurrentSong(song)"
            >
              <span
                v-if="song.alias.length != 0"
                v-html="
                  brightenKeyword(
                    `${song.name} (${song.alias}) - ${song.artists[0].name}`,
                    keywords
                  )
                "
              ></span>
              <span
                v-else
                v-html="
                  brightenKeyword(
                    `${song.name} - ${song.artists[0].name}`,
                    keywords
                  )
                "
              ></span>
            </li>
          </ul>
          <ul class="detail-list" v-if="suggest.artists">
            <li class="list-title">
              <img
                class="list-icon"
                :src="require('@/assets/search/singer.png')"
              />歌手
            </li>
            <li
              class="list-item"
              v-for="artist in suggest.artists"
              :key="artist.id"
              @click="toDetail('SingerDetail', artist.id)"
            >
              <span v-html="brightenKeyword(artist.name, keywords)"></span>
            </li>
          </ul>
          <ul class="detail-list" v-if="suggest.albums">
            <li class="list-title">
              <img
                class="list-icon"
                :src="require('@/assets/search/album.png')"
              />专辑
            </li>
            <li
              class="list-item"
              v-for="album in suggest.albums"
              :key="album.id"
              @click="toDetail('AlbumDetail', album.id)"
            >
              <span
                v-html="
                  brightenKeyword(
                    `${album.name} - ${album.artist.name}`,
                    keywords
                  )
                "
              ></span>
            </li>
          </ul>
          <ul class="detail-list" v-if="suggest.playlists">
            <li class="list-title">
              <img
                class="list-icon"
                :src="require('@/assets/search/playlist.png')"
              />歌单
            </li>
            <li
              class="list-item"
              v-for="list in suggest.playlists"
              :key="list.id"
              @click="toDetail('SongListDetail', list.id)"
            >
              <span v-html="brightenKeyword(list.name, keywords)"></span>
            </li>
          </ul>
        </div>
        <div class="local" v-else>
          <div class="history-list" v-if="searchHistorys.length != 0">
            <div class="title">
              搜索历史
              <img
                class="title-icon"
                :src="require('@/assets/search/wastebasket.png')"
                @click="clearSearchHistory()"
              />
            </div>
            <ul class="list">
              <li
                class="list-item"
                v-for="item in searchHistorys"
                :key="item"
                @click.stop="handleSearch(item)"
              >
                <div class="item-detail">
                  <span class="detail-content">{{ item }}</span>
                  <img
                    class="close-icon"
                    :src="require('@/assets/search/close.png')"
                    @click.stop="deleteSearchHistory(item)"
                  />
                </div>
              </li>
            </ul>
          </div>
          <div class="hot-list">
            <div class="title">热搜榜</div>
            <ul class="list">
              <li
                class="list-item"
                v-for="(item, index) in hots"
                :key="item.searchWord"
                @click.stop="handleSearch(item.searchWord)"
              >
                <div
                  class="item-index"
                  :class="index + 1 <= 3 ? 'item-index__top3' : ''"
                >
                  {{ index + 1 }}
                </div>
                <div class="item-detail">
                  <div
                    class="detail-title"
                    :class="index + 1 <= 3 ? 'detail-title__top3' : ''"
                  >
                    {{ item.searchWord }}
                    <img
                      class="icon"
                      :class="item.iconType == 5 ? 'icon__type5' : ''"
                      v-if="item.iconUrl"
                      :src="`${item.iconUrl}`"
                    />
                    <span class="score">{{ item.score }}</span>
                  </div>
                  <div class="detail-content">
                    {{ item.content }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </ay-popover>
</template>

<script>
const DEFAULT_KEY_WORD = "搜索音乐、视频、歌词";
import { getSearchDefaultWord, getSearchHot, getSearchSuggest } from "@/api";
import { AyInput, AyPopover } from "@/base";
import {
  getArtistsText,
  formatSong,
  brightenKeyword,
  musicMixin,
} from "@/utils";
export default {
  name: "Search",
  mixins: [musicMixin],
  components: { AyInput, AyPopover },
  data() {
    return {
      show: false,
      realKeyword: "",
      keywords: "",
      showKeyword: DEFAULT_KEY_WORD,
      hots: [],
      suggest: {},
      showSuggest: false,
      searchHistorys: [],
    };
  },
  created() {
    this.getDefaultWord();
    this.getHot();
    let history = localStorage.getItem("searchHistory");
    if (history) {
      this.searchHistorys = history.split(",");
    }
  },
  watch: {
    keywords(word) {
      if (word) {
        this.showSuggest = true;
        this.getSuggest(word);
      } else {
        this.showSuggest = false;
        this.suggest = {};
      }
    },
  },
  methods: {
    getArtistsText,
    brightenKeyword,
    handleFocus() {
      this.show = true;
    },
    handleBlur() {
      this.show = false;
    },
    handleSetCurrentSong(song) {
      this.setCurrentSong(
        formatSong({
          id: song.id,
          name: song.name,
          artists: song.artists,
          duration: song.duration,
          mvId: song.mvid,
          img: song.album.picUrl,
          albumId: song.album.id,
        })
      );
    },
    toDetail(name, id) {
      if (name) {
        this.$router.push({ name, params: { id } });
        console.log(name);
      }
    },
    async getDefaultWord() {
      const {
        data: { showKeyword, realkeyword },
      } = await getSearchDefaultWord();
      this.showKeyword = showKeyword ? showKeyword : DEFAULT_KEY_WORD;
      this.realkeyword = realkeyword;
    },
    async getHot() {
      const { data } = await getSearchHot();
      this.hots = data;
    },
    async getSuggest(keywords) {
      const { result } = await getSearchSuggest({ keywords });
      this.suggest = result;
    },
    async handleSearch(words) {
      const { keywords, realkeyword } = this;
      let word = words || keywords || realkeyword;
      if (word !== "") {
        this.handleSearchHistory(word);
        localStorage.setItem("searchHistory", this.searchHistorys.toString());
        this.$router.push({
          name: "Search",
          params: { keywords: word },
        });
      }
      this.keywords = "";
    },
    handleSearchHistory(value) {
      for (let i = 0; i < this.searchHistorys.length; i++) {
        if (value === this.searchHistorys[i]) {
          this.searchHistorys.splice(i, 1);
        }
      }
      if (this.searchHistorys.length < 10) {
        this.searchHistorys.unshift(value);
      } else {
        this.searchHistorys.pop();
        this.searchHistorys.unshift(value);
      }
    },
    clearSearchHistory() {
      localStorage.clear();
      this.searchHistorys.length = 0;
    },
    deleteSearchHistory(value) {
      localStorage.removeItem(value);
      for (let i = 0; i < this.searchHistorys.length; i++) {
        if (value === this.searchHistorys[i]) {
          this.searchHistorys.splice(i, 1);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.popover {
  .input {
    .img-wrap {
      height: 100%;
      width: 30px;
      margin-left: 5px;
      transition: 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.5;
      img {
        width: 14px;
        height: 14px;
      }
    }
    &:hover {
      .img-wrap {
        opacity: 1;
      }
    }
  }
}
.data-list {
  max-height: 460px;
  border-radius: 10px;
  background-color: $white;
  overflow-y: auto;
  .suggest-list {
    font-size: $font-size-sm;
    .title {
      color: $grey-dark;
      font-size: $font-size;
      margin: 8px 3px;
    }
    .detail-list {
      .list-icon {
        vertical-align: top;
        width: 16px;
        height: 16px;
        margin: 0 5px 0 2px;
      }
      .list-title {
        background-color: $grey-light;
        font-size: $font-size;
        padding: 6px 6px;
      }
      .list-item {
        padding: 6px 0 6px 30px;
        cursor: pointer;
        transition: 0.3s;
        &:hover {
          background-color: $grey;
        }
      }
    }
  }
  .local {
    .history-list {
      .title {
        padding: 10px 20px;
        color: $grey-dark;
        font-size: $font-size;
        .title-icon {
          vertical-align: top;
          width: 15px;
          height: 15px;
          cursor: pointer;
          margin: 0 4px;
        }
      }
      .list {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-left: 15px;
        .list-item {
          border: 1px solid $grey;
          border-radius: 15px;
          margin: 5px 5px;
          cursor: pointer;
          &:hover {
            background-color: $grey;
          }
          .item-detail {
            position: relative;
            text-align: center;
            padding: 4px 18px 6px;
            .detail-content {
              font-size: $font-size-sm;
            }
            .close-icon {
              position: absolute;
              display: none;
              right: 3px;
              top: 8px;
              vertical-align: middle;
              width: 14px;
              height: 14px;
              cursor: pointer;
            }
            &:hover .close-icon {
              display: block;
            }
          }
        }
      }
    }
    .hot-list {
      .title {
        padding: 10px 20px;
        color: $grey-dark;
        font-size: $font-size;
      }
      .list {
        .list-item {
          padding: 8px 20px;
          display: flex;
          transition: 0.3s;
          cursor: pointer;
          align-items: center;
          &:hover {
            background-color: $grey;
          }
          .item-index {
            width: 12%;
            font-size: 18px;
            color: $grey-dark;
            &__top3 {
              color: red;
            }
          }
          .item-detail {
            font-size: $font-size-sm;
            .detail-title {
              padding: 4px 0;
              &__top3 {
                font-weight: bold;
              }
              .icon {
                width: 25px;
                margin: 0 4px;
                &__type5 {
                  width: 10px;
                }
              }
              .score {
                color: $grey-dark;
              }
            }
            .detail-content {
              color: $grey-dark;
              padding: 4px 0;
            }
          }
        }
      }
    }
  }
}
</style>
