<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import Background from "../assets/desktopHome.svg";

const router = useRouter();

// --- Data ---
const surahList = ref<any[]>([]);
const selectedSurah = ref<any>(null);
const ayahs = ref<any[]>([]);
const loadingSurah = ref(true);
const loadingAyah = ref(false);

// Fetch list surah
const fetchSurahList = async () => {
  try {
    const res = await fetch("https://api.alquran.cloud/v1/surah");
    const data = await res.json();
    surahList.value = data.data;
  } catch {
    console.error("Gagal fetch surah");
  } finally {
    loadingSurah.value = false;
  }
};

// Fetch ayat dari surah yang dipilih
const selectSurah = async (surah: any) => {
  selectedSurah.value = surah;
  loadingAyah.value = true;
  ayahs.value = [];
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,id.indonesian`,
    );
    const data = await res.json();
    const arabic = data.data[0].ayahs;
    const indo = data.data[1].ayahs;
    const bismillah = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";

    ayahs.value = arabic.map((a: any, i: number) => {
      let arabicText = a.text;
      let hasBismillah = false;

      if (a.numberInSurah === 1 && surah.number !== 1 && surah.number !== 9) {
        arabicText = a.text.replace(bismillah, "").trim();
        hasBismillah = true;
      }

      return {
        number: a.numberInSurah,
        arabic: arabicText,
        translation: indo[i].text,
        hasBismillah,
      };
    });
  } catch {
    console.error("Gagal fetch ayat");
  } finally {
    loadingAyah.value = false;
  }
};

onMounted(() => {
  document.querySelectorAll("canvas").forEach((c) => c.remove());
  fetchSurahList();
});
</script>

<template>
  <div class="fixed inset-0 flex flex-col overflow-hidden">
    <img
      :src="Background"
      class="absolute inset-0 w-full h-full object-cover -z-10"
      alt=""
    />

    <!-- Header -->
    <header
      class="flex items-center px-8 py-4 gap-4 border-b border-white/10 bg-black/20 backdrop-blur-md"
    >
      <button
        @click="router.push('/')"
        class="text-white/60 hover:text-white text-sm flex items-center gap-1"
      >
        ← Back
      </button>
      <h1
        class="flex-1 text-center font-bold text-lg text-white tracking-widest uppercase"
      >
        {{
          selectedSurah
            ? `${selectedSurah.englishName} — ${selectedSurah.name}`
            : "Al-Quran"
        }}
      </h1>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside
        class="w-52 bg-black/20 backdrop-blur-md border-r border-white/10 overflow-y-auto shrink-0"
      >
        <div v-if="loadingSurah" class="text-white/40 text-center text-xs p-4">
          Memuat...
        </div>
        <div
          v-for="surah in surahList"
          :key="surah.number"
          @click="selectSurah(surah)"
          class="flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-white/5 hover:bg-white/10 transition-colors"
          :class="
            selectedSurah?.number === surah.number
              ? 'bg-white/15 border-l-2 border-l-jomud'
              : ''
          "
        >
          <span class="text-white/30 text-xs w-5 text-right shrink-0">{{
            surah.number
          }}</span>
          <div>
            <div class="text-white text-sm font-medium">
              {{ surah.englishName }}
            </div>
            <div class="text-white/40 text-xs">{{ surah.name }}</div>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <main class="flex-1 overflow-y-auto p-8">
        <div
          v-if="!selectedSurah"
          class="flex items-center justify-center h-full"
        >
          <p class="text-white/30 text-lg">Pilih surah di sebelah kiri</p>
        </div>
        <div
          v-else-if="loadingAyah"
          class="flex items-center justify-center h-full"
        >
          <p class="text-white/50">Memuat ayat...</p>
        </div>
        <div v-else class="space-y-4 max-w-2xl mx-auto">
          <div
            v-for="ayah in ayahs"
            :key="ayah.number"
            class="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <!-- Bismillah terpisah -->
            <p
              v-if="ayah.hasBismillah"
              class="text-center text-2xl leading-loose text-white/70 mb-4 pb-4 border-b border-white/10"
              style="font-family: Amiri, serif"
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
            <span
              class="text-xs text-jomud font-bold bg-jomud/10 px-2 py-0.5 rounded-full"
              >{{ ayah.number }}</span
            >
            <p
              class="text-right text-2xl leading-loose text-white mt-4 mb-3"
              style="font-family: Amiri, serif"
            >
              {{ ayah.arabic }}
            </p>
            <p
              class="text-sm text-white/60 leading-relaxed border-t border-white/10 pt-3"
            >
              {{ ayah.translation }}
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
aside::-webkit-scrollbar {
  width: 4px;
}
aside::-webkit-scrollbar-track {
  background: transparent;
}
aside::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 999px;
}
aside::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

main::-webkit-scrollbar {
  width: 4px;
}
main::-webkit-scrollbar-track {
  background: transparent;
}
main::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 999px;
}
main::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
