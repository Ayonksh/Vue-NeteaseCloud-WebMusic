<template>
  <div v-if="totalPage" class="ay-pagination">
    <div @click="prev" class="btn">
      <img
        class="icon"
        :src="require('@/assets/icon/arrow-left-bold-dark.png')"
      />
    </div>
    <ul class="list">
      <li
        class="item"
        :class="1 === currentPage ? 'active' : ''"
        v-if="totalPage > 0"
        @click="onPageClick(1)"
      >
        1
      </li>
      <li class="item" v-if="showPrevMore">...</li>
      <li
        class="item"
        :class="page === currentPage ? 'active' : ''"
        v-for="page in pages"
        :key="page"
        @click="onPageClick(page)"
      >
        {{ page }}
      </li>
      <li class="item" v-if="showNextMore">...</li>
      <li
        class="item"
        :class="totalPage === currentPage ? 'active' : ''"
        v-if="totalPage > 1"
        @click="onPageClick(totalPage)"
      >
        {{ totalPage }}
      </li>
    </ul>
    <div @click="next" class="btn">
      <img
        class="icon"
        :src="require('@/assets/icon/arrow-right-bold-dark.png')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "AyPagination",
  model: {
    prop: "currentPage",
    event: "pageChange",
  },
  props: {
    currentPage: Number,
    limit: Number,
    total: Number,
    pageCount: {
      default: 7,
      type: Number,
    },
  },
  data() {
    return {
      pages: [],
      showPrevMore: false,
      showNextMore: false,
    };
  },
  computed: {
    canNext() {
      return this.currentPage !== this.totalPage;
    },
    canPrev() {
      return this.currentPage !== 1;
    },
    totalPage() {
      return Math.ceil(this.total / this.limit);
    },
  },
  mounted() {
    this.initPages();
  },
  watch: {
    currentPage() {
      this.initPages();
    },
    totalPage() {
      this.initPages();
    },
  },
  methods: {
    prev() {
      if (this.canPrev) {
        this.$emit("pageChange", this.currentPage - 1);
        this.$emit("prev", this.currentPage);
      }
    },
    next() {
      if (this.canNext) {
        this.$emit("pageChange", this.currentPage + 1);
        this.$emit("next", this.currentPage);
      }
    },
    onPageClick(page) {
      this.$emit("pageChange", page);
    },
    initPages() {
      const pageCount = this.pageCount; // 默认为 7
      const halfpageCount = (pageCount - 1) / 2; // 3
      const currentPage = this.currentPage;
      const totalPage = this.totalPage;
      const array = [];
      let showPrevMore = false;
      let showNextMore = false;

      // 总页数大于需要显示的按钮数
      if (totalPage > pageCount) {
        // 5
        if (currentPage > pageCount - halfpageCount) {
          showPrevMore = true;
        }
        // 96
        if (currentPage < totalPage - halfpageCount) {
          showNextMore = true;
        }
      }

      if (showPrevMore && !showNextMore) {
        const startPage = totalPage - (pageCount - 2);
        for (let i = startPage; i < totalPage; i++) {
          array.push(i);
        }
      } else if (!showPrevMore && showNextMore) {
        for (let i = 2; i < pageCount; i++) {
          array.push(i);
        }
      } else if (showPrevMore && showNextMore) {
        const offset = Math.floor(pageCount / 2) - 1;
        for (let i = currentPage - offset; i <= currentPage + offset; i++) {
          array.push(i);
        }
      } else {
        for (let i = 2; i < totalPage; i++) {
          array.push(i);
        }
      }
      this.showPrevMore = showPrevMore;
      this.showNextMore = showNextMore;
      this.pages = array;
    },
  },
};
</script>

<style lang="scss" scoped>
.ay-pagination {
  user-select: none;
  display: flex;
  width: 100%;
  .list {
    display: flex;
    .item {
      margin: 0 8px;
      cursor: pointer;
      &:hover {
        color: $theme-color;
      }
    }
    .active {
      color: $theme-color;
    }
  }
  .btn {
    cursor: pointer;
    .icon {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
