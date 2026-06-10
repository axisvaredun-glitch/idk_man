<script lang="ts" setup>
import BaseDialog from "../molecules/BaseDialog.vue";
defineProps<{ modelValue: boolean }>();
defineEmits(['update:modelValue']);
</script>

<template>
  <BaseDialog :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)">
    <template #title>
      <h2 class="text-white font-bold text-xl mb-6">Settings</h2>
    </template>
    <template #inside>
      <p class="text-white">Isi setting di sini</p>
    </template>
  </BaseDialog>
</template>