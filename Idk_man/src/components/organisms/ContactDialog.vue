<script lang="ts" setup>
import BaseDialog from "../molecules/BaseDialog.vue";
defineProps<{ modelValue: boolean }>();
defineEmits(["update:modelValue"]);
</script>

<template>
  <BaseDialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <template #title>
      <h2 class="text-white font-bold text-xl mb-6">Contact</h2>
    </template>
    <template #inside>
      <div class="">
        <p class="my-5 text-white">No : +62 851-2369-2913</p>
        <p class="my-5 text-white">Ig : Maap kgk ada</p>
        <p class="my-5 text-white">Wa : +62 851-2369-2913</p>
        <p class="my-5 text-white">Email : MuhHazAlzam@gmail.com</p>
      </div>
    </template>
  </BaseDialog>
</template>
