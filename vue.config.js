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
};
