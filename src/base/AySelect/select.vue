<template>
  <div class="ay-select-wrap">
    <ay-popover
      :show="show"
      :wrapStyle="popoverStyle"
      trigger="manual"
      :placement="placement"
    >
      <div
        class="input-wrap"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
      >
        <input
          ref="input"
          :style="inputStyle"
          :value="selectedValue"
          :placeholder="
            checkedIdx !== null
              ? list[checkedIdx] && list[checkedIdx][labelName]
              : multiple && checkedList.length
              ? ''
              : placeholder
          "
          type="text"
          readonly
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <div class="img-wrap">
          <img
            v-if="!show && !showClear"
            :src="require('@/assets/icon/arrow-down.png')"
            @mousedown.prevent
            @click="dropdown"
          />
          <img
            v-if="show && !showClear"
            :src="require('@/assets/icon/arrow-up.png')"
            @mousedown.prevent
            @click="pullup"
          />
          <img
            v-if="showClear"
            :src="require('@/assets/icon/close.png')"
            @mousedown.prevent
            @click.stop="clearAll"
          />
        </div>
        <div ref="checkList" class="mul-check-wrap">
          <div
            class="check-item"
            v-for="checkedIdx in checkedList"
            :key="checkedIdx"
          >
            <div>
              {{ list[checkedIdx] && list[checkedIdx][labelName] }}
            </div>
            <div
              class="mul-check-close-wrap"
              @click.stop="clearTargetIdx(checkedIdx)"
            >
              <img :src="require('@/assets/icon/close-2.png')" />
            </div>
          </div>
        </div>
      </div>
      <template slot="content">
        <div ref="list" class="list-wrap">
          <div
            class="item"
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
            @mousedown="handleCheck($event, item, idx)"
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
const MD_INPUT_MIN_HEIGHT = 36;
const INPUT_PADDINT_TOP = 2;
import AyPopover from "../AyPopover/popover.vue";
export default {
  name: "AySelect",
  components: { AyPopover },
  props: {
    popoverWidth: {
      type: String,
    },
    placement: {
      type: String,
      default: "bottom",
    },
    width: {
      type: String,
      default: "100px",
    },
    // item 名称
    labelName: {
      type: String,
      default: "label",
    },
    // item 值
    valueName: {
      type: String,
      default: "value",
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    list: {
      type: Array,
      required: true,
    },
    defaultIdx: {
      default: null,
    },
    // 多选
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
      popoverStyle: {
        width: this.popoverWidth,
      },
      show: false,
      focused: false,
      hovering: false,
      height: MD_INPUT_MIN_HEIGHT,
      checkedIdx: this.defaultIdx,
      checkedList: [],
    };
  },
  mounted() {
    if (!this.popoverWidth) {
      this.popoverStyle.width = this.width; // 以输入框宽度为选择器列表宽度
    }
  },
  computed: {
    selectedValue() {
      return this.checkedIdx !== null
        ? this.list[this.checkedIdx] &&
            this.list[this.checkedIdx][this.labelName]
        : "";
    },
    inputStyle() {
      const { height } = this;
      let border;
      if (this.isFocus) {
        border = "1px solid #409eff";
      }
      return {
        width: this.width,
        height: `${height}px`,
        padding: `${INPUT_PADDINT_TOP}px 12px`,
        border: border,
      };
    },
    isFocus() {
      return (this.hasValue || this.show) && this.focused;
    },
    showClear() {
      return this.clearable && this.hovering && this.hasValue;
    },
    hasValue() {
      return this.multiple
        ? Array.isArray(this.checkedList) && this.checkedList.length > 0
        : this.selectedValue !== undefined &&
            this.selectedValue !== null &&
            this.selectedValue !== "";
    },
  },
  watch: {
    multiple(multiple) {
      if (multiple) {
        this.checkedIdx = null;
      } else {
        this.checkedList = [];
        this.height = MD_INPUT_MIN_HEIGHT;
      }
    },
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
    height() {
      this.resetPopoverPosition();
    },
  },
  methods: {
    handleFocus() {
      this.show = true;
      this.focused = true;
      this.$emit("focus");
    },
    handleBlur() {
      this.show = false;
      this.focused = false;
      this.$emit("blur");
    },
    dropdown() {
      this.show = true;
      this.$refs.input.focus(); // 使输入框获取焦点
      this.focused = true;
    },
    pullup() {
      this.show = false;
      this.focused = false;
    },
    handleCheck(e, item, idx) {
      if (!this.multiple) {
        this.checkedIdx = idx;
        this.show = false;
      } else {
        e.preventDefault(); // 多选情况下阻止 input 失焦，使列表不关闭
        const idxInList = this.checkedList.indexOf(idx);
        idxInList > -1
          ? this.checkedList.splice(idxInList, 1)
          : this.checkedList.push(idx);
      }
    },
    resetInputHeight() {
      const [{ offsetHeight }, offset] = [
        this.$refs.checkList,
        INPUT_PADDINT_TOP * 2,
      ];
      // offsetHeight > MD_INPUT_MIN_HEIGHT - offset &&
      //   (this.height = offsetHeight + offset);
      if (offsetHeight > MD_INPUT_MIN_HEIGHT - offset) {
        this.height = offsetHeight + offset;
      } else {
        this.height = MD_INPUT_MIN_HEIGHT;
      }
    },
    resetPopoverPosition() {
      this.show = false;
      setTimeout(() => {
        this.show = true;
      }, 250); // 多次试验将值定为 250 ，可能不同电脑的最优更新时隙不一样
    },
    clearAll() {
      if (!this.multiple) {
        this.checkedIdx = null;
      } else {
        this.checkedList = [];
        this.height = MD_INPUT_MIN_HEIGHT;
      }
      this.show = false;
      this.$emit("clear");
    },
    clearTargetIdx(target) {
      const idxInList = this.checkedList.indexOf(target);
      this.checkedList.splice(idxInList, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.ay-select-wrap {
  .input-wrap {
    min-width: 80px;
    width: 100%;
    position: relative;
    input {
      width: 100%;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
      box-sizing: border-box;
      transition: 0.3s;
      @include text-ellipsis;
      &:focus {
        outline: none;
        border: 1px solid #409eff;
      }
      &:hover {
        border: 1px solid $grey-dark;
      }
    }
    .img-wrap {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 6px;
      height: 36px;
      z-index: 20;
      opacity: 0.5;
      transition: 0.3s;
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        width: 16px;
        height: 16px;
      }
    }
    .mul-check-wrap {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      margin: 0 25px 0 4px;
      line-height: 18px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      pointer-events: none;
      .check-item {
        position: relative;
        height: 20px;
        padding: 4px 20px 4px 8px;
        margin: 2px;
        font-size: 12px;
        color: #909399;
        background-color: #f4f4f5;
        border: 1px solid #dcdfe6;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        .mul-check-close-wrap {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 4px;
          height: 100%;
          @include circle(13px);
          background-color: #c0c4cc;
          cursor: pointer;
          pointer-events: auto;
          img {
            width: 13px;
            height: 13px;
          }
        }
      }
    }
    // &::before {
    //   content: "";
    //   position: absolute;
    //   top: -1px;
    //   right: -1px;
    //   bottom: -1px;
    //   left: -1px;
    // }
    &:hover {
      .img-wrap {
        opacity: 1;
      }
    }
  }
}
.list-wrap {
  max-height: 300px;
  overflow-y: auto;
  .item {
    width: 100%;
    height: 36px;
    line-height: 36px;
    padding: 0 18px;
    cursor: pointer;
    transition: 0.3s;
    &.checked {
      color: #409eff;
      font-weight: bold;
    }
    &:hover {
      background-color: $grey;
    }
  }
}
</style>
