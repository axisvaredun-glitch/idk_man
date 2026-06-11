<!-- Time.vue -->
<script setup lang="ts">
import { useSettingsStore } from "../stores/setting";
const settings = useSettingsStore();
import alarmOn from "../assets/alaramOn.svg";
import alarmOff from "../assets/alaramOff.svg";
import calendar from "../assets/calendar.svg";

import { useRouter } from "vue-router";
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
const router = useRouter();

// --- Waktu ---
const now = ref(new Date());
setInterval(() => (now.value = new Date()), 1000);

const hour = computed(() => now.value.getHours());

// Tentukan fase waktu
const timePhase = computed(() => {
  const h = hour.value;
  if (h >= 4 && h < 6) return "subuh"; // sebelum matahari terbit
  if (h >= 6 && h < 11) return "pagi"; // pagi
  if (h >= 11 && h < 15) return "siang"; // siang
  if (h >= 15 && h < 18) return "sore"; // sore
  if (h >= 18 && h < 19) return "magrib"; // magrib
  return "malam"; // malam
});

// Warna langit per fase
const skyColor = computed(
  () =>
    ({
      subuh: { top: "#1a1a4e", bottom: "#f4845f" },
      pagi: { top: "#87ceeb", bottom: "#b0e0ff" },
      siang: { top: "#87ceeb", bottom: "#c9f0ff" },
      sore: { top: "#ff7043", bottom: "#ffcc80" },
      magrib: { top: "#6a0572", bottom: "#ff6f00" },
      malam: { top: "#0a0a2e", bottom: "#1a1a4e" },
    })[timePhase.value],
);

const groundColor = computed(
  () =>
    ({
      subuh: "#2d4a1e",
      pagi: "#7dc832",
      siang: "#7dc832",
      sore: "#5a8c1a",
      magrib: "#3a5c10",
      malam: "#1a2e08",
    })[timePhase.value],
);

const sunMoonVisible = computed(
  () => timePhase.value !== "malam" && timePhase.value !== "subuh",
);
const showMoon = computed(
  () => timePhase.value === "malam" || timePhase.value === "subuh",
);

// Posisi matahari berdasarkan jam (arc dari kiri ke kanan)
const sunPosition = computed(() => {
  const h = hour.value;
  const progress = (h - 6) / 12; // 0 = jam 6, 1 = jam 18
  const x = 10 + progress * 80; // 10% sampai 90% lebar
  const y = 20 + Math.sin(progress * Math.PI) * -15; // arc ke atas
  return { x: `${x}%`, y: `${y}%` };
});

// --- GPS & Jadwal Sholat ---
const lat = ref<number | null>(null);
const lon = ref<number | null>(null);
const prayerTimes = ref<Record<string, string>>({});
const cityName = ref("Mencari lokasi...");
const loadingPrayer = ref(true);
const errorMsg = ref("");

const fetchPrayerTimes = async (latitude: number, longitude: number) => {
  try {
    const today = now.value;
    const d = today.getDate();
    const m = today.getMonth() + 1;
    const y = today.getFullYear();

    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=${latitude}&longitude=${longitude}&method=${settings.hisabMethod}`,
    );
    const data = await res.json();
    const timings = data.data.timings;

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=id`,
    );

    const geoData = await geoRes.json();
    cityName.value =
      geoData.address.city ||
      geoData.address.town ||
      geoData.address.village ||
      "Lokasi Kamu";

    prayerTimes.value = {
      Subuh: timings.Fajr,
      Syuruq: timings.Sunrise,
      Dzuhur: timings.Dhuhr,
      Ashar: timings.Asr,
      Magrib: timings.Maghrib,
      Isya: timings.Isha,
    };
    await fetchHijriDate();
  } catch {
    errorMsg.value = "Gagal mengambil jadwal sholat.";
  } finally {
    loadingPrayer.value = false;
  }
};

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lat.value = pos.coords.latitude;
        lon.value = pos.coords.longitude;
        fetchPrayerTimes(lat.value, lon.value);
      },
      () => {
        errorMsg.value = "Izin lokasi ditolak.";
        loadingPrayer.value = false;
      },
    );
  } else {
    errorMsg.value = "Browser tidak mendukung GPS.";
    loadingPrayer.value = false;
  }

  setTimeout(() => {
    document.querySelectorAll("canvas").forEach((c) => {
      if (c !== starCanvas.value) c.remove();
    });

    if (starCanvas.value) {
      starCanvas.value.width = window.innerWidth;
      starCanvas.value.height = window.innerHeight;
      initStars(starCanvas.value);
      if (showMoon.value) animateStars(starCanvas.value);
    }
  }, 100);
});

// Jam sekarang formatted
const currentTime = computed(() =>
  now.value.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
);

// --- Bintang ---
const starCanvas = ref<HTMLCanvasElement | null>(null);
let mouseX = 0;
let mouseY = 0;
let animFrameId: number;

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

const stars: Star[] = [];

const initStars = (canvas: HTMLCanvasElement) => {
  stars.length = 0;
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.6; // hanya di bagian langit
    stars.push({
      x,
      y,
      baseX: x,
      baseY: y,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random(),
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      twinkleOffset: Math.random() * Math.PI * 2,
    });
  }
};

const animateStars = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d")!;
  let t = 0;

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 1;

    stars.forEach((star) => {
      // Kelap kelip
      star.alpha =
        0.4 +
        0.6 * Math.abs(Math.sin(t * star.twinkleSpeed + star.twinkleOffset));

      // Bergeser dikit ke arah berlawanan dari pointer (parallax)
      const dx = mouseX - star.baseX;
      const dy = mouseY - star.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;
      const strength = Math.max(0, 1 - dist / maxDist) * 8;
      star.x += (star.baseX - dx * 0.02 * strength - star.x) * 0.05;
      star.y += (star.baseY - dy * 0.02 * strength - star.y) * 0.05;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 220, ${star.alpha})`;
      ctx.fill();
    });

    animFrameId = requestAnimationFrame(draw);
  };
  draw();
};

const onMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

// Watch fase waktu untuk show/hide bintang

watch(showMoon, (val) => {
  if (val && starCanvas.value) {
    animateStars(starCanvas.value);
  } else {
    cancelAnimationFrame(animFrameId);
    if (starCanvas.value) {
      const ctx = starCanvas.value.getContext("2d")!;
      ctx.clearRect(0, 0, starCanvas.value.width, starCanvas.value.height);
    }
  }
});

watch(() => settings.hisabMethod, () => {
  if (lat.value && lon.value) {
    loadingPrayer.value = true;
    fetchPrayerTimes(lat.value, lon.value);
  }
});

onUnmounted(() => {
  cancelAnimationFrame(animFrameId);
});

// Alarm state
const alarmStates = ref<Record<string, boolean>>({
  Subuh: false,
  Syuruq: false,
  Dzuhur: false,
  Ashar: false,
  Magrib: false,
  Isya: false,
});

const toggleAlarm = (name: string) => {
  alarmStates.value[name] = !alarmStates.value[name];
};

// Tanggal Masehi
const currentDate = computed(() =>
  now.value.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
);

// Tanggal Hijriah dari API
const hijriDate = ref("");

const fetchHijriDate = async () => {
  try {
    const d = now.value.getDate();
    const m = now.value.getMonth() + 1;
    const y = now.value.getFullYear();
    const res = await fetch(`https://api.aladhan.com/v1/gToH/${d}-${m}-${y}`);
    const data = await res.json();
    const h = data.data.hijri;
    hijriDate.value = `${h.day} ${h.month.en} ${h.year} H`;
  } catch {
    hijriDate.value = "";
  }
};
</script>

<template>
  <div
    class="fixed inset-0 overflow-hidden select-none"
    @mousemove="onMouseMove"
    loading="lazy"
  >
    <!-- Background SVG dinamis -->
    <svg
      class="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="skyColor.top" />
          <stop offset="100%" :stop-color="skyColor.bottom" />
        </linearGradient>
      </defs>

      <!-- Langit -->
      <rect width="100%" height="100%" fill="url(#skyGrad)" />

      <!-- Matahari -->
      <circle
        v-if="sunMoonVisible"
        :cx="sunPosition.x"
        :cy="sunPosition.y"
        r="40"
        fill="#FFD600"
        opacity="0.95"
      />

      <!-- Bulan -->
      <g v-if="showMoon">
        <circle cx="75%" cy="15%" r="35" fill="#fffde7" />
        <circle cx="77%" cy="13%" r="30" :fill="skyColor.top" />
      </g>

      <!-- Tanah -->
      <ellipse cx="50%" cy="105%" rx="70%" ry="40%" :fill="groundColor" />
    </svg>

    <!-- Canvas Bintang -->
    <canvas
      v-show="showMoon"
      ref="starCanvas"
      class="absolute inset-0 w-full h-full pointer-events-none z-1"
    />

    <!-- Tombol Back -->
    <button
      @click="router.push('/')"
      class="absolute top-4 left-4 z-50 text-white bg-black/30 hover:bg-slate-600 hover:opacity-80 px-4 py-2 rounded-full text-sm backdrop-blur-sm"
    >
      ← Back
    </button>

    <!-- Konten -->
    <div
      class="absolute inset-0 flex flex-col items-center justify-center z-10 px-4"
    >
      <!-- Jam -->
      <div
        class="text-white text-6xl font-bold drop-shadow-lg mb-1 tracking-widest"
      >
        {{ currentTime }}
      </div>
      <div class="text-white/70 text-sm mb-8">{{ cityName }}</div>

      <!-- Jadwal Sholat -->
      <div
        class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-xl"
      >
        <!-- Tanggal -->
        <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/20">
          <img :src="calendar" class="size-5 brightness-0 invert" />
          <div>
            <div class="text-white text-sm font-medium">{{ currentDate }}</div>
            <div class="text-white/60 text-xs">{{ hijriDate }}</div>
          </div>
        </div>

        <h2 class="text-white font-bold text-center text-lg mb-4">
          Jadwal Sholat
        </h2>

        <div v-if="loadingPrayer" class="text-white/60 text-center text-sm">
          Mengambil jadwal...
        </div>
        <div v-else-if="errorMsg" class="text-red-300 text-center text-sm">
          {{ errorMsg }}
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="(time, name) in prayerTimes"
            :key="name"
            class="flex justify-between items-center text-white text-sm px-2"
          >
            <span class="font-medium">{{ name }}</span>
            <div class="flex items-center gap-3">
              <span class="text-white/80">{{ time }}</span>
              <img
                :src="alarmStates[name] ? alarmOn : alarmOff"
                class="size-5 cursor-pointer brightness-0 invert hover:scale-110 transition-transform"
                @click="toggleAlarm(name as string)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
