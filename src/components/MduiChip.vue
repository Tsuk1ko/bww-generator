<template>
  <div class="mdui-chip">
    <span class="mdui-chip-icon" :class="color">
      <i class="mdui-icon material-icons">{{icon}}</i>
    </span>
    <span class="mdui-chip-title mdui-text-truncate" style="max-width:200px">
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'mdui-chip',
  props: {
    icon: String,
    color: String,
  },
};
</script>

<style scoped>
.mdui-chip {
  box-shadow: none !important;
  cursor: unset !important;
}
</style>
