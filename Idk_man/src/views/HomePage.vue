<!-- Home.vue -->
<script setup lang="ts">
import Background from "../assets/desktopHome.svg";
// @ts-ignore
import { animate, stagger, splitText } from "https://esm.sh/animejs";
import { onMounted } from "vue";
import QuotesHero from "./QuotesHero.vue";
onMounted(() => {
  animate(".transis", {
    y: [80, 0],
    opacity: [0, 1],
    duration: 800,
    delay: stagger(150),
    ease: "outBounce",
  });
  animate(".trans-dim", {
    y: [80, 0],
    duration: 800,
    ease: "outBounce",
  });
});
onMounted(() => {
  const { chars } = splitText(".logo-text", { words: false, chars: true });

  animate(chars, {
    y: [
      { to: "-1.75rem", ease: "outExpo", duration: 600 },
      { to: 0, ease: "outBounce", duration: 800, delay: 100 },
    ],
    rotate: {
      from: "-1turn",
      delay: 0,
    },
    delay: stagger(50),
    ease: "inOutCirc",
    loopDelay: 5000,
    loop: true,
  });
});
</script>

<template>
  <div class="overflow-hidden relative w-full h-full" loading="lazy">
    <img
      :src="Background"
      class="background  h-screen w-screen object-cover absolute inset-0 -z-50"
      alt=""
    />
    <div>
      <div class="w-[50%]"></div>
      <img
        loading="lazy"
        class="absolute top-17 right-0 lg:-right-10 lg:-top-20 w-[60%] object-cover -z-10 scale-x-[-1] brightness-0 invert opacity-5 trans-dim"
        src="../assets/noun-islam-8398941.svg"
        alt=""
      />
    </div>
    <QuotesHero class="" />
  </div>
</template>
