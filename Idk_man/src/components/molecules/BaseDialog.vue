<script lang="ts" setup>
defineProps<{ modelValue: boolean }>();
defineEmits(["update:modelValue"]);
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <!-- Blur -->
    <div
      @click="$emit('update:modelValue', false)"
      class="absolute inset-0 backdrop-blur-sm bg-black/30"
    ></div>
    <!-- Cardnya -->
    <div
      class="pointer-events-auto relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl md:p-8 p-4 mx-2  w-125 shadow-2xl"
    >
      <slot name="title"></slot>
      <slot name="inside"></slot>
      <div class="flex justify-end">
        <button
          @click="$emit('update:modelValue', false)"
          class="mt-6 text-white/50 hover:text-white text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
