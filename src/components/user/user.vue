<template>
  <ay-popover
    class="user"
    :customStyle="popoverStyle"
    trigger="hover"
    placement="bottom"
    :closeDelay="200"
  >
    <div class="logined">
      <div class="img-wrap">
        <img v-lazy="getImgUrl(userAvatarUrl, 140, 100)" />
      </div>
      <span class="name">{{ userNickname }}</span>
    </div>
    <template slot="content">
      <div class="detail-wrap">
        <div class="trend">
          <div class="item">
            <h1>{{ userEventCount }}</h1>
            <span>动态</span>
          </div>
          <div class="item">
            <h1>{{ userFollows }}</h1>
            <span>关注</span>
          </div>
          <div class="item">
            <h1>{{ userFolloweds }}</h1>
            <span>粉丝</span>
          </div>
        </div>
        <div class="sign-wrap">
          <div class="signed" v-if="userMobileSign">已签到</div>
          <div class="sign" v-else @click="signin()">
            <img :src="require('@/assets/user/sign.png')" />
            签到
          </div>
        </div>
        <ul class="selection">
          <ul class="list" v-for="(ul, idx) in ulData" :key="idx">
            <li class="list-item" v-for="(li, idx) in ul" :key="idx">
              <img
                class="icon"
                :src="require(`@/assets/user/${li.iconPath}`)"
              />
              {{ li.title }}
              <img
                class="icon__right"
                :src="require('@/assets/icon/arrow-right-bold-dark.png')"
              />
            </li>
          </ul>
        </ul>
        <div class="logout" @click="logout()">
          <img :src="require('@/assets/user/logout.png')" />
          退出登录
        </div>
      </div>
    </template>
  </ay-popover>
</template>

<script>
import { dailySignin } from "@/api";
import { AyPopover } from "@/base";
import { getImgUrl, userLogout, userMixin } from "@/utils";

export default {
  name: "user",
  mixins: [userMixin],
  components: { AyPopover },
  data() {
    return {
      popoverStyle: {
        width: "250px",
      },
      ulData: [
        [
          { title: "会员中心", iconPath: "vip.png" },
          { title: "等级", iconPath: "rank.png" },
          { title: "商城", iconPath: "market.png" },
        ],
        [
          { title: "个人信息设置", iconPath: "setting.png" },
          { title: "社交账号绑定", iconPath: "binding.png" },
        ],
        [{ title: "我的客服", iconPath: "client.png" }],
      ],
    };
  },
  methods: {
    getImgUrl,
    async signin() {
      let timestamp = new Date().getTime();
      let result = await dailySignin({ timestamp: timestamp });
      if (result.code === 200) {
        this.setMobileSign(true);
      }
    },
    async logout() {
      await userLogout();
    },
  },
};
</script>

<style lang="scss" scoped>
.user {
  .logined {
    display: flex;
    align-items: center;
    transition: 0.3s;
    .img-wrap {
      margin-right: 8px;
      display: flex;
      align-items: center;
      img {
        @include circle(30px);
      }
    }
    .name {
      font-size: $font-size-sm;
      opacity: 0.7;
      &:hover {
        opacity: 1;
      }
    }
  }
}
.detail-wrap {
  font-size: $font-size;
  .trend {
    display: flex;
    justify-content: space-between;
    text-align: center;
    padding: 18px 0 10px;
    cursor: pointer;
    .item {
      font-size: $font-size-sm;
      width: 33%;
      &:nth-child(2) {
        border-left: solid 1px $grey;
        border-right: solid 1px $grey;
      }
      h1 {
        font-size: 20px;
      }
      span {
        color: $grey-dark;
        margin-top: 4px;
      }
    }
  }
  .sign-wrap {
    display: flex;
    justify-content: center;
    transition: 0.3s;
    border-bottom: solid 1px $grey;
    .signed {
      width: 80px;
      height: 30px;
      margin: 5px 0 10px;
      padding: 6px;
      border: solid $grey 1px;
      border-radius: 15px;
      text-align: center;
      color: $grey-dark;
    }
    .sign {
      width: 80px;
      height: 30px;
      margin: 5px 0 10px;
      padding: 5px 12px;
      border: solid $grey 1px;
      border-radius: 15px;
      cursor: pointer;
      img {
        width: 18px;
        height: 18px;
        vertical-align: bottom;
        margin-right: 0;
      }
      &:hover {
        background-color: $grey-light;
      }
    }
  }
  .selection {
    .list {
      border-bottom: solid 1px $grey;
      .list-item {
        padding: 10px;
        transition: 0.3s;
        cursor: not-allowed;
        .icon {
          width: 16px;
          height: 16px;
          vertical-align: text-bottom;
          margin-right: 5px;
        }
        .icon__right {
          width: 15px;
          height: 15px;
          vertical-align: text-bottom;
          float: right;
        }
        &:hover {
          background-color: $grey;
        }
      }
    }
  }
  .logout {
    cursor: pointer;
    padding: 0 10px;
    height: 44px;
    line-height: 48px;
    transition: 0.3s;
    img {
      width: 16px;
      height: 16px;
      vertical-align: text-bottom;
      margin-right: 5px;
    }
    &:hover {
      background-color: $grey;
    }
  }
}
</style>
