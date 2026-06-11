import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const mosqueRadius = ref(2000); // meter
  const hisabMethod = ref(11); // 11 = JAKIM (Malaysia/Indonesia)
  const quranFontSize = ref(24); // px

  return { mosqueRadius, hisabMethod, quranFontSize };
});