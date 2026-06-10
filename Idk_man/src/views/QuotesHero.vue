<script setup lang="ts">
import { ref } from "vue";

const quotes = [
  { text: "Sesungguhnya bersama kesulitan ada kemudahan.", source: "QS. Al-Insyirah: 6" },
  { text: "Dan cukuplah Allah sebagai penolong.", source: "QS. An-Nisa: 132" },
  { text: "Allah tidak membebani seseorang melainkan sesuai kesanggupannya.", source: "QS. Al-Baqarah: 286" },
  { text: "Boleh jadi kamu membenci sesuatu, padahal ia amat baik bagimu.", source: "QS. Al-Baqarah: 216" },
  { text: "Dan bertawakkallah kepada Allah, cukuplah Allah sebagai pemelihara.", source: "QS. Al-Ahzab: 3" },
];

const randomQuote = ref(quotes[Math.floor(Math.random() * quotes.length)]);
</script>

<template>
  <div class="absolute inset-0 flex items-center px-16 pointer-events-none">
    
    <!-- Kiri: Quote -->
    <div class="hero-text flex-1 max-w-lg">
      <p class="text-white/40 text-sm tracking-widest uppercase mb-4 transis">Quote Hari Ini</p>
      <h2 class="text-white text-3xl font-bold leading-relaxed mb-4 transis">
        "{{ randomQuote.text }}"
      </h2>
      <p class="text-jomud text-sm tracking-wider transis">— {{ randomQuote.source }}</p>
    </div>
  </div>
</template>