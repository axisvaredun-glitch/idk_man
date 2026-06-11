<script lang="ts" setup>
import BaseDialog from "../molecules/BaseDialog.vue";
import { useRouter } from "vue-router";
import mosqueTime from "../../assets/mosqueTime.svg";
import quranSvg from "../../assets/quran.svg";
import islamicSvg from "../../assets/islamic.svg";
import mosqueFinderSvg from "../../assets/mosqueFinder.svg";

import { onUnmounted } from "vue";

defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue"]);

const router = useRouter();

import { useParticles } from "../../composables/useParticles.ts";

const {
  spawnParticles,
  updateHoverPos,
  startHoverParticles,
  stopHoverParticles,
} = useParticles();

const goToTime = () => {
  emit("update:modelValue", false);
  stopHoverParticles();
  document.querySelectorAll("canvas").forEach((c) => c.remove());
  setTimeout(() => {
    router.push("/time");
  }, 150);
};
const goToQuran = () => {
  emit("update:modelValue", false);
  stopHoverParticles();
  document.querySelectorAll("canvas").forEach((c) => c.remove());
  setTimeout(() => {
    router.push("/quran");
  }, 150);
};
const goToNurul = () => {
  emit("update:modelValue", false);
  stopHoverParticles();
  document.querySelectorAll("canvas").forEach((c) => c.remove());
  setTimeout(() => {
    router.push("/nurul");
  }, 150);
};
const goToMosque = () => {
  emit("update:modelValue", false);
  stopHoverParticles();
  document.querySelectorAll("canvas").forEach((c) => c.remove());
  setTimeout(() => {
    router.push("/mosque");
  }, 150);
};

onUnmounted(() => {
  stopHoverParticles();
  document.querySelectorAll("canvas").forEach((c) => c.remove());
});
</script>

<template>
  <BaseDialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <template #title>
      <h2 class="text-white font-bold text-xl mb-6">Option</h2>
    </template>
    <template #inside>
      <div class="flex flex-wrap gap-10 items-center" loading="lazy">
        <img
          :src="mosqueTime"
          title="Waktu Shalat"
          class="size-15 brightness-0 invert hover:invert-0 cursor-pointer pointer-events-auto"
          @click="
            (e) => {
              goToTime();
              spawnParticles(e, 40, 12);
            }
          "
          @mouseenter="startHoverParticles"
          @mousemove="updateHoverPos"
          @mouseleave="stopHoverParticles"
          alt="Waktu Masjid"
        />
        <img
          :src="quranSvg"
          title="Al-Quran"
          class="size-15 brightness-0 invert hover:invert-0 cursor-pointer pointer-events-auto"
          @click="(e) => {
              goToQuran();
              spawnParticles(e, 40, 12);
            }
          "
          @mouseenter="startHoverParticles"
          @mousemove="updateHoverPos"
          @mouseleave="stopHoverParticles""
          alt="Al-Quran"
        />
        <img
          :src="islamicSvg"
          title="Sirah"
          class="size-15 brightness-0 invert hover:invert-0 cursor-pointer pointer-events-auto"
          @click="(e) => {
              goToNurul();
              spawnParticles(e, 40, 12);
            }
          "
          @mouseenter="startHoverParticles"
          @mousemove="updateHoverPos"
          @mouseleave="stopHoverParticles""
          alt="Al-Quran"
        />
        <img
          :src="mosqueFinderSvg"
          title="Sirah"
          class="size-15 brightness-0 invert hover:invert-0 cursor-pointer pointer-events-auto"
          @click="(e) => {
              goToMosque();
              spawnParticles(e, 40, 12);
            }
          "
          @mouseenter="startHoverParticles"
          @mousemove="updateHoverPos"
          @mouseleave="stopHoverParticles""
          alt="Al-Quran"
        />
      </div>
    </template>
  </BaseDialog>
</template>