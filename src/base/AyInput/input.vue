<template>
  <div class="ay-input-wrap">
    <div class="prepend-wrap" :style="prependStyle">
      <slot name="prepend"></slot>
    </div>
    <div
      class="input-wrap"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
      <div class="fix prefix-wrap" ref="prefix" :style="prefixStyle">
        <slot name="prefix"></slot>
      </div>
      <input
        :value="value"
        :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :style="[wrapStyle, inputStyle]"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div class="fix suffix-wrap" ref="suffix" :style="suffixStyle">
        <template v-if="!showClear || !showPwdVisible">
          <slot name="suffix"></slot>
        </template>
        <img
          v-if="showClear"
          :src="require('@/assets/icon/close.png')"
          @mousedown.prevent
          @click="clear"
        />
        <img
          v-if="showPwdVisible"
          :src="require('@/assets/icon/showpwd.png')"
          @click="handlePasswordVisible"
        />
      </div>
    </div>
    <div class="append-wrap" :style="appendStyle">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script>
const SM_MIN_INPUT_HEIGHT = 32;
const MD_MIN_INPUT_HEIGHT = 36;
const LG_MIN_INPUT_HEIGHT = 40;
const INPUT_PADDING_TOP = 2;
const INPUT_PADDING_BOTTOM = 2;
const MIN_INPUT_PADDING_LEFT = 12;
const MIN_INPUT_PADDING_RIGHT = 12;
const DEFAULT_TYPE = [
  "button",
  "checkbox",
  "color",
  "date",
  "datetime-local",
  "email",
  "file",
  "hidden",
  "image",
  "month",
  "number",
  "password",
  "radio",
  "range",
  "search",
  "submit",
  "reset",
  "tel",
  "text",
  "time",
  "url",
  "week",
];

export default {
  name: "AyInput",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: String,
    type: {
      type: String,
      validator: (type) => DEFAULT_TYPE.indexOf(type) > -1,
      default: "text",
    },
    size: {
      type: String,
      validator: (type) => ["sm", "md", "lg"].indexOf(type) > -1,
      default: "md",
    },
    wrapStyle: Object,
    placeholder: String,
    disabled: Boolean,
    readonly: Boolean,
    clearable: {
      type: Boolean,
      default: false,
    },
    showPassword: {
      type: Boolean,
      default: false,
    },
    showWordLimit: {
      type: Boolean,
      default: false,
    },
    autofocus: Boolean,
    label: String,
    prepend: String,
    append: String,
    minlength: Number,
    maxlength: Number,
  },
  data() {
    return {
      prefixWidth: MIN_INPUT_PADDING_LEFT,
      suffixWidth: MIN_INPUT_PADDING_RIGHT,
      focused: false,
      hovering: false,
      passwordVisible: false,
    };
  },
  mounted() {
    if (this.$refs.prefix) {
      this.prefixWidth = Math.max(
        this.$refs.prefix.offsetWidth,
        MIN_INPUT_PADDING_LEFT
      );
    }
    if (this.$refs.suffix) {
      this.suffixWidth = Math.max(
        this.$refs.suffix.offsetWidth,
        MIN_INPUT_PADDING_RIGHT
      );
    }
  },
  computed: {
    inputHeight() {
      const map = {
        sm: SM_MIN_INPUT_HEIGHT,
        md: MD_MIN_INPUT_HEIGHT,
        lg: LG_MIN_INPUT_HEIGHT,
      };
      return map[this.size];
    },
    inputStyle() {
      const { inputHeight, suffixWidth, prefixWidth } = this;
      return {
        height: `${inputHeight}px`,
        padding: `${INPUT_PADDING_TOP}px ${suffixWidth}px ${INPUT_PADDING_BOTTOM}px ${prefixWidth}px`,
      };
    },
    fixStyle() {
      const { inputHeight } = this;
      return {
        height: `${inputHeight}px`,
      };
    },
    prefixStyle() {
      const { fixStyle } = this;
      return { ...fixStyle };
    },
    suffixStyle() {
      const { fixStyle } = this;
      return { ...fixStyle };
    },
    prependStyle() {
      const { fixStyle } = this;
      return { ...fixStyle };
    },
    appendStyle() {
      const { fixStyle } = this;
      return { ...fixStyle };
    },
    showClear() {
      return (
        this.clearable &&
        !this.readonly &&
        this.hasValue &&
        (this.focused || this.hovering)
      );
    },
    showPwdVisible() {
      return (
        this.showPassword && !this.readonly && (!!this.hasValue || this.focused)
      );
    },
    hasValue() {
      return this.value === null || this.value === undefined
        ? ""
        : String(this.value);
    },
  },
  methods: {
    handleInput(event) {
      this.$emit("change", event.target.value);
    },
    handleFocus() {
      this.focused = true;
      this.$emit("focus");
    },
    handleBlur() {
      this.focused = false;
      this.$emit("blur");
    },
    clear() {
      this.$emit("input", "");
      this.$emit("change", "");
      this.$emit("clear");
    },
    handlePasswordVisible() {
      this.passwordVisible = !this.passwordVisible;
    },
  },
};
</script>

<style lang="scss" scoped>
.ay-input-wrap {
  display: flex;
  position: relative;
  .input-wrap {
    min-width: 120px;
    width: 100%;
    position: relative;
    input {
      width: 100%;
      border-radius: 5px;
      border: 1px solid #dcdfe6;
      transition: 0.3s;
      box-sizing: border-box;
      &:hover {
        border: 1px solid $grey-dark;
      }
      &:focus {
        outline: none;
        border: 1px solid #409eff;
      }
    }
    .fix {
      z-index: 20;
      transition: 0.3s;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .prefix-wrap {
      left: 0;
    }
    .suffix-wrap {
      right: 0;
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
}
</style>
