<!-- App.vue -->
<script setup lang="ts">
import logo from "./assets/logo.png";

import { ref } from "vue";
// Navbar Import
import SettingDialog from "./components/organisms/SettingDialog.vue";
const showSetting = ref(false);

import AboutDialog from "./components/organisms/AboutDialog.vue";
const showAbout = ref(false);

import ContactDialog from "./components/organisms/ContactDialog.vue";
const showContact = ref(false);

import OptionDialog from "./components/organisms/OptionDialog.vue";
const showOption = ref(false);

import { useRoute } from "vue-router";
const route = useRoute();

import { useParticles } from "../src/composables/useParticles.ts";

const { spawnParticles, updateHoverPos, startHoverParticles, stopHoverParticles } = useParticles();

</script>

<template class="">
  <div class="fixed inset-0 overflow-hidden">
    <header
      v-if="route.path === '/'"
      class="absolute pointer-events-auto w-full items-center px-10 py-4 flex z-50"
    >
      <div class="transis flex gap-2 items-center">
        <img :src="logo" alt="" class="size-10 text-center" />
        <h1 class="logo-text font-bold text-2xl text-jomud tracking-widest">
          Alfa
        </h1>
      </div>
      <div class="flex flex-1 justify-center items-center text-center">
        <nav class="transis gap-40 hidden md:flex text-jomud">
          <a
            href="#"
            @click="
              (e) => {
                spawnParticles(e, 40, 12);
                showOption = true;
              }
            "
            @mouseenter="startHoverParticles"
            @mousemove="updateHoverPos"
            @mouseleave="stopHoverParticles"
            class="hover:text-green-700"
            >Option</a
          >
          <a
            href="#"
            @click="
              (e) => {
                spawnParticles(e, 40, 12);
                showContact = true;
              }
            "
            @mouseenter="startHoverParticles"
            @mousemove="updateHoverPos"
            @mouseleave="stopHoverParticles"
            class="hover:text-green-700"
            >Contact</a
          >
          <a
            href="#"
            @click="
              (e) => {
                spawnParticles(e, 40, 12);
                showAbout = true;
              }
            "
            @mouseenter="startHoverParticles"
            @mousemove="updateHoverPos"
            @mouseleave="stopHoverParticles"
            class="hover:text-green-700"
            >About</a
          >
          <a
            href="#"
            @click="
              (e) => {
                spawnParticles(e, 40, 12);
                showSetting = true;
              }
            "
            @mouseenter="startHoverParticles"
            @mousemove="updateHoverPos"
            @mouseleave="stopHoverParticles"
            class="hover:text-green-700"
            >Settings</a
          >
        </nav>
      </div>
      <div class="w-[95.19px]"></div>
    </header>
    <RouterView/>
    <SettingDialog v-model="showSetting"> </SettingDialog>
    <AboutDialog v-model="showAbout"></AboutDialog>
    <ContactDialog v-model="showContact"></ContactDialog>
    <OptionDialog v-model="showOption"></OptionDialog>
  </div>
</template>
