<script>
export default {
  name: "AyTabNav",
  inject: ["root"],
  data() {
    return {
      activeBarWidth: 0,
      activeBarOffsetLeft: 0,
    };
  },
  computed: {
    navStyle() {
      const placement = this.root.center ? "center" : "space-between";
      return {
        justifyContent: placement,
      };
    },
    activeNavStyle() {
      const style = {
        fontWeight: "bold",
        color: this.root.activeColor ? this.root.activeColor : "#d33a31",
      };
      return style;
    },
    activeBarStyle() {
      const style = {
        width: this.activeBarWidth,
        transform: `translateX(${this.activeBarOffsetLeft}px)`,
      };
      if (this.root.activeColor) style.backgroundColor = this.root.activeColor;
      return style;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getActiveBarPosition(`ref_${this.root.currentName}`);
    });
  },
  watch: {
    "root.currentName"(currentName) {
      this.getActiveBarPosition(`ref_${currentName}`);
    },
  },
  methods: {
    handleCurrentNameChange(pane) {
      this.root.currentName = pane.name;
      this.$emit("navClick", pane.name);
    },
    getActiveBarPosition(refName) {
      const ele = this.$refs[refName];
      if (ele) {
        const { width } = window.getComputedStyle(ele);
        this.activeBarWidth = width;
        this.activeBarOffsetLeft = ele.offsetLeft;
      }
    },
  },
  render() {
    return (
      <div class="ay-tab-nav-wrap" style={this.navStyle}>
        <div class="ay-tab-nav">
          {this.root.panes.map((pane) => (
            <div
              class={["ay-tab-nav__item"]}
              style={
                this.root.currentName === pane.name ? this.activeNavStyle : ""
              }
              onClick={() => {
                this.handleCurrentNameChange(pane);
              }}
              key={pane.name}
              ref={`ref_${pane.name}`}
            >
              {pane.label}
            </div>
          ))}
          <div class="active-bar" style={this.activeBarStyle}></div>
        </div>
        <div class="ay-tab-nav-slot-wrap">{this.$slots.default}</div>
      </div>
    );
  },
};
</script>

<style lang="scss" scoped>
.ay-tab-nav-wrap {
  border-bottom: 1px $grey solid;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  .ay-tab-nav {
    display: flex;
    position: relative;
    &__item {
      margin: 0 12px;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
    }
    .active-bar {
      transition: 0.3s;
      position: absolute;
      left: 0;
      bottom: -1.5px;
      height: 2px;
      background-color: $theme-color;
    }
  }
}
</style>
