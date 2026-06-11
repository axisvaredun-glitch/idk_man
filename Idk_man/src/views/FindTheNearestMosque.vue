<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const router = useRouter();

const userLat = ref<number | null>(null);
const userLon = ref<number | null>(null);
const mosques = ref<any[]>([]);
const loading = ref(false);
const errorMsg = ref("");

const getLocation = () => {
  loading.value = true;
  errorMsg.value = "";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat.value = pos.coords.latitude;
        userLon.value = pos.coords.longitude;
        fetchMosques(userLat.value, userLon.value);
      },
      () => {
        errorMsg.value = "Izin lokasi ditolak.";
        loading.value = false;
      },
    );
  } else {
    errorMsg.value = "Browser tidak mendukung GPS.";
    loading.value = false;
  }
};

const fetchMosques = async (lat: number, lon: number) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=masjid&lat=${lat}&lon=${lon}&format=json&limit=20&bounded=1&viewbox=${lon - 0.02},${lat + 0.02},${lon + 0.02},${lat - 0.02}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    const data = await res.json();
    mosques.value = data
      .map((el: any) => ({
        id: el.place_id,
        name: el.display_name.split(",")[0],
        lat: parseFloat(el.lat),
        lon: parseFloat(el.lon),
        distance: getDistance(lat, lon, parseFloat(el.lat), parseFloat(el.lon)),
      }))
      .sort((a: any, b: any) => a.distance - b.distance);
  } catch {
    errorMsg.value = "Gagal mengambil data masjid.";
  } finally {
    loading.value = false;
  }
};

const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const openMaps = (lat: number, lon: number, name: string) => {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_id=${name}`,
    "_blank",
  );
};

onMounted(() => {
  document.querySelectorAll("canvas").forEach((c) => c.remove());
  getLocation();
});

const quotes = [
  {
    text: "Sesungguhnya bersama kesulitan ada kemudahan.",
    source: "QS. Al-Insyirah: 6",
  },
  { text: "Dan cukuplah Allah sebagai penolong.", source: "QS. An-Nisa: 132" },
  {
    text: "Allah tidak membebani seseorang melainkan sesuai kesanggupannya.",
    source: "QS. Al-Baqarah: 286",
  },
  {
    text: "Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
    source: "QS. Ar-Ra'd: 28",
  },
  {
    text: "Dan janganlah kamu berputus asa dari rahmat Allah.",
    source: "QS. Az-Zumar: 53",
  },
];

const randomQuote = ref(quotes[Math.floor(Math.random() * quotes.length)]);
</script>

<template>
  <div
    class="fixed inset-0 bg-linear-to-b from-green-950 to-green-900 flex flex-col"
  >
    <!-- Header -->
    <header
      class="relative flex items-center px-6 py-4 gap-4 border-b border-white/10"
    >
      <button
        @click="router.push('/')"
        class="text-white/60 hover:text-white text-sm absolute"
      >
        ← Back
      </button>
      <h1
        class="flex-1 text-center text-white font-bold tracking-widest uppercase text-sm"
      >
        Masjid Terdekat
      </h1>
    </header>

    <!-- Konten -->
    <div class="flex-1 overflow-y-auto px-4 py-6">
      <!-- Loading -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center h-full gap-3"
      >
        <div
          class="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"
        ></div>
        <p class="text-white/50 text-sm">Mencari masjid terdekat...</p>
      </div>

      <!-- Error -->
      <div
        v-else-if="errorMsg"
        class="flex flex-col items-center justify-center h-full gap-4"
      >
        <p class="text-red-300 text-sm">{{ errorMsg }}</p>
        <button
          @click="getLocation"
          class="text-white bg-white/10 px-4 py-2 rounded-full text-sm hover:bg-white/20"
        >
          Coba Lagi
        </button>
      </div>

      <!-- List Masjid -->
      <div v-else-if="mosques.length" class="space-y-3 max-w-lg mx-auto">
        <p class="text-white/40 text-xs text-center mb-4">
          {{ mosques.length }} masjid ditemukan dalam radius 2km
        </p>
        <div
          v-for="mosque in mosques"
          :key="mosque.id"
          class="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 hover:bg-white/10 transition-colors cursor-pointer"
          @click="openMaps(mosque.lat, mosque.lon, mosque.name)"
        >
          <div class="flex-1 min-w-0">
            <p class="text-white font-medium text-sm truncate">
              {{ mosque.name }}
            </p>
            <p class="text-white/40 text-xs mt-0.5">
              {{ mosque.distance }}m dari lokasi kamu
            </p>
          </div>
          <div class="text-white/30 text-xs shrink-0">Maps →</div>
        </div>
      </div>

      <!-- Kosong -->
      <div v-else class="flex items-center justify-center h-full">
        <p class="text-white/30 text-sm">
          Tidak ada masjid ditemukan dalam radius 2km
        </p>
      </div>
    </div>
  </div>
  <div
    class="absolute bottom-10 left-10 max-w-xs pointer-events-none text-center md:text-left"
  >
    <p class="text-white/50 text-xs leading-relaxed italic">
      "{{ randomQuote.text }}"
    </p>
    <p class="text-white/50 text-xs mt-1 md:text-left text-center">
      — {{ randomQuote.source }}
    </p>
  </div>
</template>
