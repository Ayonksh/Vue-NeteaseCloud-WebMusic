<template>
  <div class="ay-input">
    <div class="ay-input__prepend" :style="prependStyle">
      <slot name="prepend"></slot>
    </div>
    <div
      class="ay-input__body"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
      <div
        class="ay-input__fix ay-input__prefix"
        :style="prefixStyle"
        ref="prefix"
      >
        <slot name="prefix"></slot>
      </div>
      <input
        class="ay-input__inner"
        :style="[inputStyle, customStyle]"
        v-bind="$attrs"
        :value="value"
        :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div
        class="ay-input__fix ay-input__suffix"
        :style="suffixStyle"
        ref="suffix"
      >
        <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
          <slot name="suffix"></slot>
        </template>
        <ay-svg-icon
          v-if="showClear"
          class="icon"
          icon="close"
          @click="clear"
        />
        <ay-svg-icon
          v-if="showPwdVisible && !passwordVisible"
          class="icon"
          icon="showpwd"
          @click="handlePasswordVisible"
        />
        <ay-svg-icon
          v-else-if="passwordVisible"
          class="icon"
          icon="hidepwd"
          @click="handlePasswordVisible"
        />
        <span v-if="isWordLimitVisible" class="ay-input__count">
          {{ textLength }}/{{ upperLimit }}
        </span>
      </div>
    </div>
    <div class="ay-input__append" :style="appendStyle">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script>
const SM_MIN_INPUT_HEIGHT = 32;
const MD_MIN_INPUT_HEIGHT = 36;
const LG_MIN_INPUT_HEIGHT = 40;
const INPUT_HEIGHT_MAP = {
  sm: SM_MIN_INPUT_HEIGHT,
  md: MD_MIN_INPUT_HEIGHT,
  lg: LG_MIN_INPUT_HEIGHT,
};
const INPUT_PADDING_TopBottom = 2;
const INPUT_PADDING_MAP = {
  sm: INPUT_PADDING_TopBottom,
  md: INPUT_PADDING_TopBottom * 1.5,
  lg: INPUT_PADDING_TopBottom * 2,
};
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
    event: "inputChange",
  },
  props: {
    value: String,
    type: {
      type: String,
      validator: (type) => DEFAULT_TYPE.indexOf(type) != -1,
      default: "text",
    },
    size: {
      type: String,
      validator: (type) => ["sm", "md", "lg"].indexOf(type) != -1,
      default: "md",
    },
    customStyle: Object,
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
  },
  data() {
    return {
      inputHeight: INPUT_HEIGHT_MAP[this.size],
      inputPadding: INPUT_PADDING_MAP[this.size],
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
    inputStyle() {
      const { inputHeight, inputPadding, suffixWidth, prefixWidth } = this;
      return {
        height: `${inputHeight}px`,
        padding: `${inputPadding}px ${suffixWidth}px ${inputPadding}px ${prefixWidth}px`,
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
        this.showPassword && !this.readonly && (!!this.hasValue || this.focused) // !!this.hasValue 是为了将此值变成变成布尔类型
      );
    },
    hasValue() {
      return this.value === null || this.value === undefined
        ? ""
        : String(this.value);
    },
    isWordLimitVisible() {
      return (
        this.showWordLimit &&
        this.$attrs.maxlength &&
        this.type === "text" &&
        !this.readonly &&
        !this.showPassword
      );
    },
    upperLimit() {
      return this.$attrs.maxlength;
    },
    textLength() {
      if (typeof this.value === "number") {
        return String(this.value).length;
      }
      return (this.value || "").length;
    },
  },
  methods: {
    handleInput(event) {
      this.$emit("inputChange", event.target.value);
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
      this.$emit("inputChange", "");
      this.$emit("clear");
    },
    handlePasswordVisible() {
      this.passwordVisible = !this.passwordVisible;
    },
  },
};
</script>

<style lang="scss" scoped>
.ay-input {
  display: flex;
  position: relative;
  .ay-input__body {
    min-width: 120px;
    width: 100%;
    position: relative;
    .ay-input__inner {
      width: 100%;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      box-sizing: border-box;
      @include text-ellipsis;
      &:hover {
        border-color: $grey-dark;
      }
      &:focus {
        outline: none;
        border-color: $blue-light;
      }
    }
    .ay-input__fix {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 20;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .ay-input__prefix {
      left: 0;
      padding: 0 6px;
    }
    .ay-input__suffix {
      right: 0;
      padding: 0 6px;
      .icon {
        font-size: 16px;
        cursor: pointer;
        opacity: 0.5;
      }
      .ay-input__count {
        color: $grey-dark;
        font-size: 12px;
      }
    }
    &:hover {
      .icon {
        opacity: 1;
      }
    }
  }
}
</style>
