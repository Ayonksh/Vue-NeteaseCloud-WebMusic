export const playModeConfig = {
  loop: { icon: require("@/assets/mini-player/列表循环.png"), key: "loop" }, // 列表循环
  order: { icon: require("@/assets/mini-player/顺序播放.png"), key: "order" }, // 顺序播放
  random: { icon: require("@/assets/mini-player/随机播放.png"), key: "random" }, // 随机播放
  single: { icon: require("@/assets/mini-player/单曲循环.png"), key: "single" }, // 单曲循环
};

export const defaultMode = playModeConfig.loop;
