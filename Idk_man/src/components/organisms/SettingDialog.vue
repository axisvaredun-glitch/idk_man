<script lang="ts" setup>
import BaseDialog from "../molecules/BaseDialog.vue";
import { useSettingsStore } from "../../stores/setting";

defineProps<{ modelValue: boolean }>();
defineEmits(['update:modelValue']);

const settings = useSettingsStore();

const hisabMethods = [
  { id: 11, name: "JAKIM (Indonesia/Malaysia)" },
  { id: 1, name: "MWL (Muslim World League)" },
  { id: 2, name: "ISNA (Amerika Utara)" },
  { id: 3, name: "MWL Egypt" },
  { id: 4, name: "Umm Al-Qura (Makkah)" },
  { id: 5, name: "University of Islamic Sciences, Karachi" },
];
</script>

<template>
  <BaseDialog :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)">
    <template #title>
      <h2 class="text-white font-bold text-xl mb-6">Settings</h2>
    </template>
    <template #inside>
      <div class="space-y-6">

        <!-- Radius Masjid -->
        <div>
          <label class="text-white/60 text-xs uppercase tracking-wider">Radius Masjid</label>
          <div class="flex items-center gap-3 mt-2">
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              v-model="settings.mosqueRadius"
              class="flex-1 accent-green-500"
            />
            <span class="text-white text-sm w-16 text-right">{{ (settings.mosqueRadius / 1000).toFixed(1) }} km</span>
          </div>
        </div>

        <!-- Metode Hisab -->
        <div>
          <label class="text-white/60 text-xs uppercase tracking-wider">Metode Hisab</label>
          <select
            v-model="settings.hisabMethod"
            class="mt-2 w-full bg-white/10 text-white text-sm rounded-xl px-3 py-2 border border-white/20 outline-none"
          >
            <option v-for="m in hisabMethods" :key="m.id" :value="m.id" class="bg-green-950">
              {{ m.name }}
            </option>
          </select>
        </div>

        <!-- Ukuran Font Quran -->
        <div>
          <label class="text-white/60 text-xs uppercase tracking-wider">Ukuran Font Al-Quran</label>
          <div class="flex items-center gap-3 mt-2">
            <input
              type="range"
              min="16"
              max="40"
              step="2"
              v-model="settings.quranFontSize"
              class="flex-1 accent-green-500"
            />
            <span class="text-white text-sm w-16 text-right">{{ settings.quranFontSize }}px</span>
          </div>
          <p class="text-right mt-2" :style="{ fontSize: settings.quranFontSize + 'px', fontFamily: 'Amiri, serif' }" style="color: rgba(255,255,255,0.5)">
            بِسْمِ ٱللَّهِ
          </p>
        </div>

      </div>
    </template>
  </BaseDialog>
</template>