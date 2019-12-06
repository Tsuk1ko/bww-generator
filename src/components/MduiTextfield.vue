<template>
  <div class="mdui-textfield">
    <label class="mdui-textfield-label">
      <slot></slot>
    </label>
    <input
      class="mdui-textfield-input"
      :type="type"
      :value="value"
      :disabled="disabled"
      @input="$emit('input', $event.target.value)"
      @mousewheel.prevent="onmousewhell"
    />
  </div>
</template>

<script>
export default {
  name: 'mdui-textfield',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: [Number, String],
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
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
.mdui-textfield-input[disabled] {
  border-bottom-color: transparent;
  cursor: not-allowed;
}
</style>
