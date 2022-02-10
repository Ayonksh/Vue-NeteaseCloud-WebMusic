<script>
export default {
  name: "AyTabPane",
  inject: ["root"],
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lazy: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    active() {
      return this.root.currentName === this.name;
    },
  },
  mounted() {
    this.root.setPanes(this);
  },
  render() {
    const { lazy, active } = this;
    return lazy ? (
      <div style={{ display: active ? "block" : "none" }}>
        {this.$slots.default}
      </div>
    ) : active ? (
      <div>{this.$slots.default}</div>
    ) : null;
  },
};
</script>

<style lang="scss" scoped></style>
