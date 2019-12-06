<template>
  <div class="mdui-textfield">
    <label class="mdui-textfield-label">
      <slot></slot>
    </label>
    <input
      class="mdui-textfield-input"
      type="text"
      :value="value"
      :disabled="disabled"
      @input="$emit('input', $event.target.value)"
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
  props: ['value', 'disabled'],
};
</script>

<style scoped>
.mdui-textfield-input[disabled] {
  border-bottom-color: transparent;
  cursor: not-allowed;
}
</style>
