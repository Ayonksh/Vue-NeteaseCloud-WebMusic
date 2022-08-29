<template>
  <div class="ay-select">
    <ay-popover
      trigger="click"
      :placement="placement"
      :width="popoverWidth"
      ref="popover"
    >
      <div
        class="ay-select__body"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
      >
        <input
          class="ay-select__input"
          :style="inputStyle"
          ref="input"
          :value="selected"
          type="text"
          :placeholder="
            checkedIdx !== null
              ? list[checkedIdx] && list[checkedIdx][labelName]
              : multiple && checkedList.length
              ? ''
              : placeholder
          "
          :disabled="disabled"
          readonly
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <div class="ay-select__suffix" :style="suffixStyle">
          <ay-svg-icon
            v-show="!showClear"
            :class="['icon', showPopover ? 'reverse' : '']"
            icon="arrow-down"
          />
          <ay-svg-icon
            v-if="showClear"
            class="icon"
            icon="close"
            @click="clear"
          />
        </div>
        <div class="ay-select__tags" ref="checkList">
          <div
            class="ay-select__tags-item"
            :style="tagStyle"
            v-for="checkedIdx in checkedList"
            :key="checkedIdx"
          >
            <span>
              {{ list[checkedIdx] && list[checkedIdx][labelName] }}
            </span>
            <div class="icon-wrapper">
              <ay-svg-icon
                class="icon"
                icon="close2"
                @click="clearTargetIdx(checkedIdx)"
              />
            </div>
          </div>
        </div>
      </div>
      <template slot="content">
        <div class="ay-select-dropdown__list" ref="list">
          <div
            class="ay-select-dropdown__list-item"
            :class="[
              !multiple &&
              list[checkedIdx] &&
              list[checkedIdx][valueName] === item[valueName]
                ? 'checked'
                : '',
              multiple && checkedList.includes(idx) ? 'checked' : '',
            ]"
            v-for="(item, idx) in list"
            :key="item[valueName]"
            @click="handleCheck($event, item, idx)"
            @mousedown.prevent
          >
            <slot name="data" :item="item">
              {{ item[labelName] }}
            </slot>
          </div>
        </div>
      </template>
    </ay-popover>
  </div>
</template>

<script>
import AyPopover from "../AyPopover/popover.vue";

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
const TAG_HEIGHT_MAP = {
  sm: SM_MIN_INPUT_HEIGHT - 16,
  md: MD_MIN_INPUT_HEIGHT - 16,
  lg: LG_MIN_INPUT_HEIGHT - 16,
};

export default {
  name: "AySelect",
  components: { AyPopover },
  model: {
    prop: "selected",
    event: "selectedChange",
  },
  props: {
    placement: {
      type: String,
      default: "bottom",
    },
    popoverWidth: {
      type: String,
    },
    size: {
      type: String,
      validator: (type) => ["sm", "md", "lg"].indexOf(type) > -1,
      default: "md",
    },
    width: {
      type: String,
      default: "80px",
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 下拉框列表
    list: {
      type: Array,
      required: true,
    },
    // 下拉框 item 名称
    labelName: {
      type: String,
      default: "label",
    },
    // 下拉框 item 值
    valueName: {
      type: String,
      default: "value",
    },
    defaultIdx: {
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputHeight: INPUT_HEIGHT_MAP[this.size],
      inputPadding: INPUT_PADDING_MAP[this.size],
      tagHeight: TAG_HEIGHT_MAP[this.size],
      initPopover: false,
      focused: false,
      hovering: false,
      checkedIdx: this.defaultIdx,
      checkedList: [],
    };
  },
  mounted() {
    if (!this.popoverWidth) {
      this.popoverWidth = this.width || this.$refs.input.width; // 以 input 宽度为 popover 宽度
    }
    this.initPopover = true; // popover 的 dom 结构挂载完毕，值设为 true
  },
  computed: {
    inputStyle() {
      const { inputHeight, inputPadding } = this;
      let borderColor;
      if (this.isFocus) {
        borderColor = "$blue-light";
      }
      return {
        width: this.width,
        height: `${inputHeight}px`,
        padding: `${inputPadding}px 22px ${inputPadding}px 12px`, // 输入框右边有图标，所以设置为 22px
        borderColor: borderColor,
      };
    },
    suffixStyle() {
      const { inputHeight } = this;
      return {
        height: `${inputHeight}px`,
      };
    },
    tagStyle() {
      const { tagHeight, inputPadding } = this;
      return {
        height: `${tagHeight}px`,
        padding: `${inputPadding}px 22px ${inputPadding}px 8px`, // 输入框右边有图标，所以设置为 22px
      };
    },
    selected() {
      return this.checkedIdx !== null
        ? this.list[this.checkedIdx] &&
            this.list[this.checkedIdx][this.labelName]
        : "";
    },
    isFocus() {
      return (this.hasValue || this.showPopover) && this.focused;
    },
    showPopover() {
      if (this.initPopover == false) {
        return false; // popover 的 dom 结构还没有挂载，返回 false
      } else {
        return this.$refs.popover.showPopover;
      }
    },
    showClear() {
      return this.clearable && this.hovering && this.hasValue;
    },
    hasValue() {
      return this.multiple
        ? Array.isArray(this.checkedList) && this.checkedList.length > 0
        : this.selected !== undefined &&
            this.selected !== null &&
            this.selected !== "";
    },
  },
  watch: {
    checkedIdx(idx) {
      this.$emit("dataChange", idx);
    },
    checkedList: {
      handler(idxList) {
        this.$emit("dataChange", idxList);
        this.$nextTick(this.resetInputHeight);
      },
      deep: true,
    },
    inputHeight() {
      this.$nextTick(this.$refs.popover.setPopoverPosition);
    },
  },
  methods: {
    handleFocus() {
      this.focused = true;
      this.$emit("focus");
    },
    handleBlur() {
      this.focused = false;
      this.$emit("blur");
    },
    handleCheck(e, item, idx) {
      // @mousedown.prevent 使下拉框选择数据之后，input 不会失焦
      if (!this.multiple) {
        this.checkedIdx = idx;
        this.$emit("selectedChange", item.code);
        // this.$refs.input.focus(); // 使输入框获取焦点
      } else {
        e.stopPropagation(); // 多选情况下阻止弹出框消失
        const idxInList = this.checkedList.indexOf(idx);
        idxInList > -1
          ? this.checkedList.splice(idxInList, 1)
          : this.checkedList.push(idx);
      }
    },
    clear() {
      if (!this.multiple) {
        this.checkedIdx = null;
      } else {
        this.checkedList = [];
        this.inputHeight = INPUT_HEIGHT_MAP[this.size];
      }
      this.$emit("clear");
    },
    clearTargetIdx(target) {
      const idxInList = this.checkedList.indexOf(target);
      this.checkedList.splice(idxInList, 1);
    },
    resetInputHeight() {
      const [{ offsetHeight }, offset] = [
        this.$refs.checkList,
        this.inputPadding * 2,
      ];
      offsetHeight >= INPUT_HEIGHT_MAP[this.size] - offset &&
        (this.inputHeight = offsetHeight + offset);
    },
  },
};
</script>

<style lang="scss" scoped>
.ay-select {
  .ay-select__body {
    min-width: 80px;
    width: 100%;
    position: relative;
    .ay-select__input {
      width: 100%;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      transition: 0.5s;
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
    .ay-select__suffix {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      padding: 0 6px;
      z-index: 20;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        font-size: 16px;
        cursor: pointer;
        opacity: 0.5;
        transition: 0.5s;
      }
      .reverse {
        transform: rotate(180deg);
      }
    }
    .ay-select__tags {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      padding: 2px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      pointer-events: none;
      .ay-select__tags-item {
        position: relative;
        font-size: 12px;
        margin: 2px;
        color: #909399;
        background-color: #f4f4f5;
        border: 1px solid #e9e9eb;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon-wrapper {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 4px;
          height: 100%;
          @include circle(12px);
          background-color: #c0c4cc;
          pointer-events: auto;
          .icon {
            font-size: 12px;
            cursor: pointer;
            opacity: 0.5;
          }
        }
      }
    }
    &:hover {
      .icon {
        opacity: 1;
      }
    }
  }
}
.ay-select-dropdown__list {
  max-height: 300px;
  overflow-y: auto;
  .ay-select-dropdown__list-item {
    width: 100%;
    height: 36px;
    line-height: 36px;
    padding: 0 18px;
    transition: 0.5s;
    cursor: pointer;
    &.checked {
      color: $blue-light;
      font-weight: bold;
    }
    &:hover {
      background-color: $grey;
    }
  }
}
</style>
