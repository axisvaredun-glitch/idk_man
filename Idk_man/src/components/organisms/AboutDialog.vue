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
      <h2 class="text-white font-bold text-2xl">About</h2>
      <div class="w-12 h-0.5 bg-jomud mb-7"></div>
    </template>
    <template #inside>
      <div class="space-y-4">
        <div class="bg-white/5 rounded-xl p-4 border border-white/10">
          <p
            class="text-jomud text-xs font-bold tracking-widest uppercase mb-2"
          >
            Tentang Proyek
          </p>
          <p class="text-white/80 text-sm leading-relaxed">
            Aplikasi web Front-End berbasis Vue.js yang dibuat sebagai sarana
            belajar coding sekaligus wadah pengaplikasian materi keagamaan
            seperti Hadits dan Doa pilihan.
          </p>
        </div>

        <div class="bg-white/5 rounded-xl p-4 border border-white/10">
          <p
            class="text-jomud text-xs font-bold tracking-widest uppercase mb-2"
          >
            Tujuan
          </p>
          <p class="text-white/80 text-sm leading-relaxed">
            Mengasah kemampuan logika pemrograman dan manipulasi antarmuka
            melalui contoh kasus nyata yang aman, bermanfaat, dan praktis.
          </p>
        </div>

        <div class="bg-white/5 rounded-xl p-4 border border-white/10">
          <p
            class="text-jomud text-xs font-bold tracking-widest uppercase mb-2"
          >
            Status
          </p>
          <div class="flex items-center gap-2">
            <div class="size-2 rounded-full bg-green-400 animate-pulse"></div>
            <p class="text-white/80 text-sm">Live di Vercel</p>
          </div>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
