const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  devServer: {
    open: true,
    port: 8054,
  },
  css: {
    loaderOptions: {
      sass: {
        // Prepends/Appends Sass/SCSS code before the actual entry file.
        additionalData: `
          @import "~@/style/transition.scss";
          @import "~@/style/variables.scss";
          @import "~@/style/mixin.scss";
          @import "~@/style/scroll.scss";
          @import "~@/style/animation.scss";
        `,
      },
    },
  },
  chainWebpack: (config) => {
    // 添加新的 svg-sprite-loader 处理 svgIcon
    config.module
      .rule("svgIcon")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/svgIcon"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });
    // 原有的 svg 图像处理 loader 添加 exclude
    config.module.rule("svg").exclude.add(resolve("src/assets/svgIcon")).end();
  },
};
