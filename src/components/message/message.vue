<template>
  <ay-popover
    :closeDelay="200"
    :wrapStyle="popoverStyle"
    trigger="click"
    placement="bottom"
  >
    <div class="message">
      <div class="img-wrap">
        <img :src="require('@/assets/head/message.png')" />
      </div>
    </div>
    <template slot="content">
      <div class="message-wrap">
        <div class="title">
          <span>消息</span>
          <span @click="allRead">一键已读</span>
        </div>
        <ay-tab v-model="activeName">
          <ay-tab-pane :name="'私信'" :label="'私信'">
            <div class="content" v-if="isLogin">
              <ul class="list">
                <li
                  class="list-item"
                  v-for="(item, idx) in privates"
                  :key="idx"
                >
                  <div class="img-wrap">
                    <img :src="`${item.fromUser.avatarUrl}`" />
                    <img
                      :src="`${item.fromUser.avatarDetail.identityIconUrl}`"
                    />
                    <span v-if="item.newMsgCount > 0"></span>
                  </div>
                  <div class="info-wrap">
                    <div class="head">
                      <span>{{ item.fromUser.nickname }}</span>
                      <span>{{ formatDate(item.lastMsgTime) }}</span>
                    </div>
                    <div class="body">{{ getMsg(item.lastMsg) }}</div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="not-login" v-else>
              <span>请先登录</span>
            </div>
          </ay-tab-pane>
          <ay-tab-pane :name="'评论'" :label="'评论'"></ay-tab-pane>
          <ay-tab-pane :name="'@我'" :label="'@我'"></ay-tab-pane>
          <ay-tab-pane :name="'通知'" :label="'通知'"></ay-tab-pane>
        </ay-tab>
      </div>
    </template>
  </ay-popover>
</template>

<script>
import { getMsgPrivate } from "@/api";
import { AyPopover, AyTab, AyTabPane } from "@/base";
import { formatDate, userMixin } from "@/utils";
export default {
  name: "Message",
  mixins: [userMixin],
  components: { AyPopover, AyTab, AyTabPane },
  data() {
    return {
      popoverStyle: {
        width: "320px",
        margin: "0",
      },
      activeName: "私信",
      privates: [],
    };
  },
  created() {
    this.initMsgPrivate();
  },
  methods: {
    formatDate,
    allRead() {
      console.log(1);
    },
    getMsg(text) {
      const msg = JSON.parse(text);
      if (msg.promotionUrl) {
        return msg.promotionUrl.text + "：「" + msg.msg + "」";
      } else {
        return msg.msg;
      }
    },
    async initMsgPrivate() {
      const { msgs } = await getMsgPrivate();
      this.privates = msgs;
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  height: $header-height;
  display: flex;
  align-items: center;
  .img-wrap {
    display: flex;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
    }
  }
}
.message-wrap {
  width: 100%;
  height: 500px;
  overflow-y: auto;
  .title {
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    span:nth-child(2) {
      color: $blue;
      font-size: $font-size-md;
      cursor: pointer;
    }
  }
  .content {
    .list {
      .list-item {
        padding: 15px 12px;
        display: flex;
        justify-content: space-around;
        cursor: pointer;
        .img-wrap {
          display: flex;
          position: relative;
          img:nth-child(1) {
            @include circle(32px);
          }
          img:nth-child(2) {
            @include circle(12px);
            position: absolute;
            right: -2px;
            bottom: -2px;
          }
          span {
            @include circle(6px);
            background-color: $theme-color;
            position: absolute;
            left: -10px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .info-wrap {
          width: 230px;
          margin-bottom: -16px;
          border-bottom: 1px solid $grey;
          display: flex;
          flex-direction: column;
          .head {
            margin-bottom: 4px;
            display: flex;
            justify-content: space-between;
            span:nth-child(1) {
              font-size: $font-size-sm;
              color: $blue;
            }
            span:nth-child(2) {
              font-size: $font-size-xs;
              color: $grey-dark;
            }
          }
          .body {
            @include text-ellipsis();
            font-size: $font-size-sm;
            color: $grey-dark;
          }
        }
        &:hover {
          background-color: $grey;
        }
      }
    }
  }
  .not-login {
    font-size: $font-size-sm;
    color: $grey-dark;
    display: flex;
    justify-content: center;
  }
}
</style>
