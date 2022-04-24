<template>
  <div class="login" @click="openLoginDialog">
    <div class="unlogin">
      <div class="img-wrap">
        <img :src="require('@/assets/head/user.png')" />
      </div>
      <span>未登录</span>
    </div>
    <ay-dialog
      class="dialog"
      v-model="dialogVisible"
      width="340px"
      :handleClose="closeLoginDialog"
    >
      <template slot="header">
        <p class="title">{{ activeTabName }}</p>
      </template>
      <ay-tab v-model="activeTabName">
        <ay-tab-pane :label="PHONE_LOGIN" :name="PHONE_LOGIN">
          <div class="form-wrap">
            <ay-input
              class="input"
              v-model="phone"
              size="lg"
              placeholder="请输入手机号"
              clearable
            >
              <template slot="prepend">
                <ay-select
                  v-model="ctcode"
                  width="80px"
                  popoverWidth="260px"
                  placement="bottom-start"
                  size="lg"
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
              class="input"
              style="margin: 0"
              v-model="captcha"
              size="lg"
              placeholder="请输入验证码"
              clearable
            >
              <template slot="prefix">
                <div class="prefix-wrap">
                  <img :src="require('@/assets/user/captcha.png')" />
                </div>
              </template>
              <template slot="append">
                <div
                  class="captcha"
                  :class="
                    captchaName.indexOf('s') != -1 ? 'captcha__notAllowed' : ''
                  "
                  @click.stop="getCaptcha()"
                >
                  {{ captchaName }}
                </div>
              </template>
            </ay-input>
            <div class="needphone">请输入手机号</div>
            <div class="login" @click.stop="login()">
              <span>登录</span>
            </div>
          </div>
        </ay-tab-pane>
        <ay-tab-pane :label="ACCOUNT_LOGIN" :name="ACCOUNT_LOGIN">
          <div class="form-wrap">
            <ay-input
              class="input"
              v-model="account"
              size="lg"
              placeholder="请输入邮箱/手机号"
              clearable
            >
              <template slot="prefix">
                <div class="prefix-wrap">
                  <img :src="require('@/assets/user/phone.png')" />
                </div>
              </template>
            </ay-input>
            <ay-input
              class="input"
              v-model="password"
              size="lg"
              placeholder="请输入密码"
              show-password
            >
              <template slot="prefix">
                <div class="prefix-wrap">
                  <img :src="require('@/assets/user/lock.png')" />
                </div>
              </template>
            </ay-input>
            <div class="login" @click.stop="login()">
              <span>登录</span>
            </div>
          </div>
        </ay-tab-pane>
        <ay-tab-pane :label="QR_LOGIN" :name="QR_LOGIN">
          <div class="qrcode-wrap">
            <img :src="qrimg" />
          </div>
        </ay-tab-pane>
      </ay-tab>
    </ay-dialog>
  </div>
</template>

<script>
const PHONE_LOGIN = "手机登录";
const ACCOUNT_LOGIN = "账号登录";
const QR_LOGIN = "扫码登录";
import {
  sentCaptcha,
  generateQRKey,
  createQRCode,
  checkQRStatus,
  getCountriesCodeList,
} from "@/api";
import { AyDialog, AyInput, AySelect, AyTab, AyTabPane } from "@/base";
import { accountLogin, captchaLogin, qrcodeLogin, userMixin } from "@/utils";

export default {
  name: "login",
  mixins: [userMixin],
  components: { AyDialog, AyInput, AySelect, AyTab, AyTabPane },
  data() {
    return {
      PHONE_LOGIN,
      ACCOUNT_LOGIN,
      QR_LOGIN,
      dialogVisible: false,
      activeTabName: PHONE_LOGIN,
      phone: "",
      ctcode: "",
      captcha: "",
      captchaName: "获取验证码",
      countDownTime: 60, // 验证码倒计时
      account: "",
      password: "",
      qrkey: "",
      qrimg: "",
      qrstatus: "",
      countriesCodeList: [],
      loading: false,
      popoverStyle: {
        padding: "4px",
        fontSize: "12px",
        color: "#f33",
      },
    };
  },
  created() {
    this.initCountriesCodeList();
  },
  watch: {
    activeTabName(activeTabName) {
      if (activeTabName == QR_LOGIN) {
        if (!this.qrkey) {
          this.getQRCode(); // 第一次打开时生成二维码
          this.getQRStatus();
        } else {
          this.getQRStatus();
        }
      }
    },
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
      if (this.activeTabName == PHONE_LOGIN) {
        await captchaLogin(this.phone, this.captcha, this.ctcode).finally(
          () => {
            this.closeLoginDialog();
          }
        );
      } else {
        await accountLogin(this.account, this.password).finally(() => {
          this.closeLoginDialog();
        });
      }
      this.setLoading(false);
    },
    async getCaptcha() {
      if (this.phone) {
        let phone = Number(this.phone);
        let timer = setInterval(() => {
          this.countDownTime--;
          this.captchaName = this.countDownTime + "s";
          if (this.countDownTime <= 0) {
            clearInterval(timer);
            this.captchaName = "重新发送";
            this.countDownTime = 60;
          }
        }, 1000);
        await sentCaptcha({ phone: phone, ctcode: this.ctcode });
      } else {
        document.querySelector(".needphone").style.visibility = "visible";
        // document.getElementsByClassName(".needphone").style.visibility = "visible";
      }
    },
    async getQRCode() {
      let timestamp = new Date().getTime();
      const keyRes = await generateQRKey({ timestamp: timestamp });
      this.qrkey = keyRes.data.unikey;
      const imgRes = await createQRCode({
        key: keyRes.data.unikey,
        qrimg: true,
        timestamp: timestamp,
      });
      this.qrimg = imgRes.data.qrimg;
    },
    async getQRStatus() {
      let timer = setInterval(async () => {
        let timestamp = new Date().getTime();
        const codeRes = await checkQRStatus({
          key: this.qrkey,
          timestamp: timestamp,
        });
        this.qrstatus = codeRes.code;
        if (this.activeTabName == QR_LOGIN) {
          if (codeRes.code === 800) {
            this.getQRCode();
          } else if (codeRes.code === 803) {
            clearInterval(timer);
            qrcodeLogin(codeRes.cookie).finally(() => {
              this.closeLoginDialog();
            });
          }
        } else {
          clearInterval(timer);
        }
      }, 5000);
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  .unlogin {
    display: flex;
    align-items: center;
    transition: 0.3s;
    cursor: pointer;
    .img-wrap {
      margin-right: 8px;
      display: flex;
      align-items: center;
      img {
        @include circle(30px);
        background-color: $grey;
      }
    }
  }
  .dialog {
    color: $black;
    .title {
      font-size: 21px;
      margin: 10px 0;
    }
    .form-wrap {
      .input {
        margin: 30px 0;
        .prefix-wrap {
          height: 100%;
          padding: 0 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          img {
            width: 16px;
            height: 16px;
          }
        }
        .captcha {
          width: 60px;
          height: 100%;
          margin: 0 10px;
          color: $blue;
          font-size: $font-size-sm;
          text-align: center;
          line-height: 36px; // 此项用来垂直居中
          cursor: pointer;
          &__notAllowed {
            cursor: not-allowed;
          }
        }
        &:nth-child(2) {
          margin-bottom: 40px;
        }
      }
      .needphone {
        margin: 10px 0;
        color: $theme-color;
        font-size: $font-size-xs;
        line-height: 20px;
        visibility: hidden;
      }
      .login {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 6px;
        color: $white;
        background-color: $theme-color;
        transition: 0.3s;
        cursor: pointer;
        @include box-shadow;
      }
    }
    .qrcode-wrap {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 200px;
        height: 200px;
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
