<template>
  <div class="mdui-textfield mdui-p-y-0">
    <label class="mdui-textfield-label no-sl">
      <slot></slot>
    </label>
    <input
      class="mdui-textfield-input mdui-p-y-0"
      :type="type"
      :value="value"
      @input="$emit('input', $event.target.value)"
      min="0"
      step="1"
      :placeholder="placeholder"
      :disabled="disabled"
      @mousewheel.prevent="onmousewhell"
    />
  </div>
</template>

<script>
export default {
  name: 'mdui-input',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: [Number, String],
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'number',
    },
  },
  methods: {
    onmousewhell({ deltaY, target }) {
      if (this.disabled || this.type !== 'number') return;
      const value = parseInt(target.value) + (deltaY > 0 ? -1 : 1);
      if (value >= 0) this.$emit('input', value);
    },
  },
};
</script>

<style scoped>
.mdui-textfield {
  width: 80px;
  display: inline-block;
}
.mdui-textfield-input {
  height: 24px;
}
.mdui-textfield-input[disabled] {
  border-bottom-color: transparent;
  cursor: not-allowed;
}
</style>
