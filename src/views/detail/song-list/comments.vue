<template>
  <ay-loading :loading="loading">
    <div class="comment-page-wrap">
      <div class="title" v-show="currentPage === 1">精彩评论</div>
      <ul class="comment-list" v-show="currentPage === 1">
        <li
          class="comment-item"
          v-for="comment in hotComments"
          :key="comment.commentId"
        >
          <comment v-bind="formatData(comment)"></comment>
        </li>
      </ul>
      <div class="title">最新评论({{ commentCount }})</div>
      <ul class="comment-list">
        <li
          class="comment-item"
          v-for="comment in comments"
          :key="comment.commentId"
        >
          <comment v-bind="formatData(comment)"></comment>
        </li>
      </ul>
      <div class="pagination-wrap">
        <ay-pagination
          v-model="currentPage"
          :limit="limit"
          :total="commentCount"
        ></ay-pagination>
      </div>
    </div>
  </ay-loading>
</template>

<script>
import { getPlayListComment } from "@/api";
import { AyLoading, AyPagination } from "@/base";
import { Comment } from "@/components";
import { formatDateTime } from "@/utils";
export default {
  name: "SongListComments",
  components: { AyLoading, AyPagination, Comment },
  props: ["id", "commentCount"],
  data() {
    return {
      hotComments: [],
      comments: [],
      loading: false,
      currentPage: 1,
      limit: 60,
      contentEl: document.getElementById("content__ref"),
    };
  },
  created() {
    this.getListData();
  },
  computed: {
    params() {
      const { id, limit, currentPage } = this;
      return {
        id,
        limit,
        offset: limit * (currentPage - 1),
      };
    },
  },
  watch: {
    params(params) {
      this.getListData(params);
    },
  },
  methods: {
    formatData(comment) {
      const res = {
        avatar: comment.user.avatarUrl,
        name: comment.user.nickname,
        date: formatDateTime(comment.time),
        content: comment.content,
        count: comment.likedCount,
      };
      if (comment.beReplied.length) {
        res.replyName = comment.beReplied[0].user.nickname;
        res.replyContent = comment.beReplied[0].content;
      }
      return res;
    },
    async getListData() {
      this.contentEl &&
        this.contentEl.scrollTo({
          left: 0,
          top: 0,
          behavior: "smooth",
        });
      this.loading = true;
      const { params } = this;
      const { hotComments, comments } = await getPlayListComment(params);
      this.hotComments = hotComments;
      this.comments = comments;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.comment-page-wrap {
  width: 96%;
  margin: 0 2%;
  font-size: $font-size-sm;
  color: $grey-dark;
  .title {
    padding: 6px 0;
  }
  .comment-list {
    margin-bottom: 24px;
    .comment-item {
      padding: 16px 0;
      border-bottom: solid $grey 1px;
    }
  }
  .pagination-wrap {
    float: right;
  }
}
</style>
