<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import Background from "../assets/desktopHome.svg";

const router = useRouter();

const name = ref("");
const email = ref("");
const message = ref("");
const loading = ref(false);
const success = ref(false);
const error = ref("");

const submit = async () => {
  loading.value = true;
  error.value = "";
  try {
    const res = await fetch("https://formspree.io/f/xeewpgaa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        message: message.value,
      }),
    });
    if (res.ok) {
      success.value = true;
      name.value = "";
      email.value = "";
      message.value = "";
    } else {
      error.value = "Gagal mengirim feedback.";
    }
  } catch {
    error.value = "Terjadi kesalahan, coba lagi.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="fixed inset-0 flex flex-col overflow-hidden">
    <img :src="Background" class="absolute inset-0 w-full h-full object-cover -z-10" alt="" />

    <!-- Header -->
    <header class="flex items-center px-6 py-4 gap-4 border-b border-white/10 bg-black/20 backdrop-blur-md">
      <button @click="router.push('/')" class="text-white/60 hover:text-white text-sm absolute">
        ← Back
      </button>
      <h1 class="flex-1 text-center font-bold text-sm text-white tracking-widest uppercase">
        Feedback
      </h1>
    </header>

    <!-- Konten -->
    <div class="flex-1 flex items-center justify-center px-4">
      <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-xl">

        <!-- Success -->
        <div v-if="success" class="text-center space-y-4">
          <p class="text-4xl">✅</p>
          <p class="text-white font-semibold">Terima kasih!</p>
          <p class="text-white/50 text-sm">Feedback kamu sudah kami terima.</p>
          <button @click="success = false" class="text-white/50 text-xs hover:text-white mt-2">
            Kirim lagi
          </button>
        </div>

        <!-- Form -->
        <div v-else class="space-y-4">
          <h2 class="text-white font-bold text-lg mb-6 text-center">Kirim Feedback</h2>

          <div>
            <label class="text-white/50 text-xs uppercase tracking-wider">Nama</label>
            <input
              v-model="name"
              type="text"
              placeholder="Nama kamu"
              class="mt-1 w-full bg-white/10 text-white text-sm rounded-xl px-4 py-3 border border-white/10 outline-none placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          <div>
            <label class="text-white/50 text-xs uppercase tracking-wider">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="email@kamu.com"
              class="mt-1 w-full bg-white/10 text-white text-sm rounded-xl px-4 py-3 border border-white/10 outline-none placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          <div>
            <label class="text-white/50 text-xs uppercase tracking-wider">Pesan</label>
            <textarea
              v-model="message"
              placeholder="Tulis feedback kamu di sini..."
              rows="4"
              class="mt-1 w-full bg-white/10 text-white text-sm rounded-xl px-4 py-3 border border-white/10 outline-none placeholder:text-white/20 focus:border-white/30 resize-none"
            />
          </div>

          <p v-if="error" class="text-red-300 text-xs">{{ error }}</p>

          <button
            @click="submit"
            :disabled="loading || !name || !email || !message"
            class="w-full bg-green-800 hover:bg-green-700 disabled:opacity-40 text-white font-medium py-3 rounded-xl transition-colors text-sm"
          >
            {{ loading ? 'Mengirim...' : 'Kirim Feedback' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>