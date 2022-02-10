<template>
  <ay-loading :width="20" :loading="userLogining">
    <div class="user-wrap">
      <user v-show="isLogin"></user>
      <login v-show="!isLogin"></login>
    </div>
  </ay-loading>
</template>

<script>
import { AyLoading } from "@/base";
import { userMixin } from "@/utils";
import login from "./login";
import user from "./user";
export default {
  name: "User",
  mixins: [userMixin],
  components: { login, user, AyLoading },
};
</script>

<style lang="scss" scoped>
.user-wrap {
  cursor: pointer;
}
</style>
