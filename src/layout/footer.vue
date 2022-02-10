<template>
  <div class="footer-wrap" id="footer__ref">
    <mini-player></mini-player>
  </div>
</template>
<script>
import { MiniPlayer } from "@/components";
export default {
  name: "LayoutFooter",
  components: { MiniPlayer },
};
</script>

<style lang="scss" scoped>
.footer-wrap {
  position: fixed;
  width: 100%;
  bottom: 0;
  height: $footer-height;
  z-index: $footer-index;
  background-color: $white;
  @include box-shadow;
}
</style>
