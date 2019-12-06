<template>
  <div class="mdui-textfield">
    <label class="mdui-textfield-label">
      <slot></slot>
    </label>
    <label class="mdui-checkbox">
      <input
        type="checkbox"
        :checked="checked"
        @change="$emit('change', $event.target.checked)"
        v-bind="$attrs"
      />
      <i class="mdui-checkbox-icon"></i>
    </label>
  </div>
</template>

<script>
export default {
  name: 'mdui-checkbox-small',
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: Boolean,
  },
};
</script>

<style scoped>
.mdui-checkbox {
  padding-left: 0 !important;
  margin-left: 2px;
}
.mdui-checkbox-icon {
  box-shadow: unset !important;
}
</style>
