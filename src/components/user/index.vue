<template>
  <div class="user-wrap">
    <user v-show="isLogin"></user>
    <login v-show="!isLogin"></login>
  </div>
</template>

<script>
import { userMixin } from "@/utils";
import login from "./login";
import user from "./user";
export default {
  name: "User",
  mixins: [userMixin],
  components: { login, user },
};
</script>

<style lang="scss" scoped>
.user-wrap {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
