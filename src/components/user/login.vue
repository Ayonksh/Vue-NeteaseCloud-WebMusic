<template>
  <div class="login-wrap" @click="openLoginDialog">
    <div class="img-wrap">
      <img :src="require('@/assets/head/user.png')" />
    </div>
    <div class="type">未登录</div>
    <ay-dialog
      class="dialog"
      v-model="dialogVisible"
      width="320px"
      :handleClose="closeLoginDialog"
    >
      <template slot="header">
        <p class="title">{{ activeName }}</p>
      </template>
      <ay-tab v-model="activeName">
        <ay-tab-pane :label="REGISTER_NAME" :name="REGISTER_NAME">
          <div class="form-wrap">
            <ay-input
              class="input"
              v-model="phone"
              placeholder="请输入手机号"
              clearable
            >
              <template slot="prepend">
                <ay-select
                  width="100px"
                  popoverWidth="260px"
                  placement="bottom-start"
                  :labelName="'code'"
                  :valueName="'en'"
                  :list="countriesCodeList"
                  :defaultIdx="0"
                  clearable
                >
                  <template v-slot:data="scopeSlot">
                    <div class="select-item-wrap">
                      <div class="item">
                        {{ scopeSlot.item.zh }}
                      </div>
                      <div class="item">
                        {{ scopeSlot.item.en }}
                      </div>
                      <div class="item">
                        {{ "+" + scopeSlot.item.code }}
                      </div>
                    </div>
                  </template>
                </ay-select>
              </template>
            </ay-input>
            <ay-input
              v-model="code"
              placeholder="请输入验证码"
              clearable
            ></ay-input>
          </div>
        </ay-tab-pane>
        <ay-tab-pane :label="LOGIN_NAME" :name="LOGIN_NAME">
          <div class="form-wrap">
            <ay-input
              v-model="account"
              placeholder="请输入邮箱/手机号"
              clearable
            >
              <template slot="prefix">
                <div class="prefix-wrap">
                  <img :src="require('@/assets/user/phone.png')" />
                </div>
              </template>
            </ay-input>
            <ay-input v-model="password" placeholder="请输入密码" show-password>
              <template slot="prefix">
                <div class="prefix-wrap">
                  <img :src="require('@/assets/user/lock.png')" />
                </div>
              </template>
            </ay-input>
          </div>
        </ay-tab-pane>
      </ay-tab>
      <template slot="footer">
        <div class="footer">
          <div
            class="register-btn btn"
            v-if="activeName === REGISTER_NAME"
            @click.stop="register()"
          >
            注册
          </div>
          <div class="login-btn btn" v-else @click.stop="login()">登录</div>
        </div>
      </template>
    </ay-dialog>
  </div>
</template>

<script>
const LOGIN_NAME = "账号登录";
const REGISTER_NAME = "用户注册";
import { getCountriesCodeList } from "@/api";
import { AyDialog, AyInput, AySelect, AyTab, AyTabPane } from "@/base";
import { userLogin, userMixin } from "@/utils";

export default {
  name: "login",
  mixins: [userMixin],
  components: { AyDialog, AyInput, AySelect, AyTab, AyTabPane },
  data() {
    return {
      REGISTER_NAME,
      LOGIN_NAME,
      dialogVisible: false,
      activeName: LOGIN_NAME,
      phone: "",
      code: "",
      account: "",
      password: "",
      countriesCodeList: [],
      loading: false,
    };
  },
  created() {
    this.initCountriesCodeList();
  },
  methods: {
    openLoginDialog() {
      this.dialogVisible = true;
    },
    closeLoginDialog() {
      this.dialogVisible = false;
    },
    async initCountriesCodeList() {
      const { data } = await getCountriesCodeList();
      const codeList = [];
      data.map((item) => codeList.push(...item.countryList));
      this.countriesCodeList = codeList;
    },
    async login() {
      this.setLoading(true);
      await userLogin(this.account, this.password).finally(() => {
        this.closeLoginDialog();
      });
      this.setLoading(false);
    },
    async register() {},
  },
};
</script>

<style lang="scss" scoped>
.login-wrap {
  padding: 0 8px;
  display: flex;
  transition: 0.3s;
  .img-wrap {
    margin-right: 8px;
    display: flex;
    align-items: center;
    img {
      @include circle(30px);
      background-color: $grey;
    }
  }
  .dialog {
    color: $black;
    .title {
      font-size: 21px;
    }
    .form-wrap {
      .input {
        width: 100%;
        line-height: 36px; // 覆盖继承自父组件的属性
        margin: 30px 0 10px;
      }
      .prefix-wrap {
        height: 100%;
        padding: 0 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 16px;
          height: 16px;
        }
      }
    }
    .footer {
      margin-bottom: 20px;
      .btn {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 6px;
        transition: 0.3s;
        cursor: pointer;
      }
      .login-btn {
        background-color: $theme-color;
        color: $white;
        @include box-shadow;
      }
      .register-btn {
        background-color: $white;
        color: $black;
        border: 2px $grey solid;
        &:hover {
          @include box-shadow;
        }
      }
    }
  }
}
.select-item-wrap {
  display: flex;
  justify-content: space-between;
  .item {
    @include text-ellipsis();
    font-size: $font-size-sm;
  }
}
</style>
