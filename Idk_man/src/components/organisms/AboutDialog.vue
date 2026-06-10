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
      <h2 class="text-white font-bold text-xl mb-6">About</h2>
    </template>
    <template #inside>
      <p class="text-white">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto sint
        eveniet hic quidem consequuntur maiores sed, tenetur deleniti expedita
        nobis est nihil quisquam commodi beatae saepe fugit! Quia, voluptate
        quibusdam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
        corrupti ratione commodi veritatis excepturi libero dolorum molestiae
        adipisci omnis, quibusdam corporis reprehenderit nihil architecto odit.
        Modi quasi repudiandae animi voluptates! Lorem ipsum dolor sit amet,
        consectetur adipisicing elit. Quis, beatae provident? Earum porro illo
        repellendus, reprehenderit numquam, consectetur ex nisi voluptate,
        quibusdam labore similique natus neque non possimus praesentium odio!
      </p>
    </template>
  </BaseDialog>
</template>
