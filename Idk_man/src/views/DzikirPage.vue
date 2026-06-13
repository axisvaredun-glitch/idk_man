<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Background from "../assets/desktopHome.svg";
import dzikirData from "../data/dzikir.json";
 
const router = useRouter();
 
// --- State ---
const activeTab = ref(0);
const completedCards = ref<Set<number>>(new Set());
const counters = ref<Record<string, number>>({});
 
const currentKitab = computed(() => dzikirData[activeTab.value]);
 
const progress = computed(() => {
  const total = currentKitab.value.bacaan.length;
  return Math.round((completedCards.value.size / total) * 100);
});
 
// Reset saat ganti tab
function switchTab(idx: number) {
  activeTab.value = idx;
  completedCards.value = new Set();
  counters.value = {};
}
 
function getCounterKey(nomor: number) {
  return `${activeTab.value}-${nomor}`;
}
 
function getCount(nomor: number) {
  return counters.value[getCounterKey(nomor)] ?? 0;
}
 
function tap(nomor: number, ulang: number) {
  const key = getCounterKey(nomor);
  const current = counters.value[key] ?? 0;
  if (current < ulang) {
    counters.value[key] = current + 1;
    if (counters.value[key] === ulang) {
      completedCards.value = new Set([...completedCards.value, nomor]);
    }
  }
}
 
function resetCounter(nomor: number) {
  const key = getCounterKey(nomor);
  counters.value[key] = 0;
  completedCards.value = new Set(
    [...completedCards.value].filter((n) => n !== nomor)
  );
}
 
const showLatin = ref<Record<number, boolean>>({});
function toggleLatin(nomor: number) {
  showLatin.value[nomor] = !showLatin.value[nomor];
}
 
onMounted(() => {
  document.querySelectorAll("canvas").forEach((c) => c.remove());
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
      class="flex items-center px-4 md:px-8 py-3 md:py-4 gap-4 border-b border-white/10 bg-black/20 backdrop-blur-md z-20 shrink-0"
    >
      <button
        @click="router.push('/')"
        class="text-white/60 hover:text-white text-sm flex items-center gap-1 shrink-0"
      >
        ← Kembali
      </button>
      <h1 class="flex-1 text-center font-bold text-xs md:text-base text-white tracking-widest uppercase">
        Dzikir & Wirid
      </h1>
      <div class="w-16 shrink-0"></div>
    </header>
 
    <!-- Tab Switcher -->
    <div class="shrink-0 px-4 md:px-8 pt-4 pb-0 z-10">
      <div class="flex gap-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 max-w-xl mx-auto">
        <button
          v-for="(kitab, idx) in dzikirData"
          :key="kitab.id"
          @click="switchTab(idx)"
          class="flex-1 py-2 px-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200"
          :class="
            activeTab === idx
              ? 'bg-jomud text-green-950 shadow-md'
              : 'text-white/50 hover:text-white'
          "
        >
          {{ kitab.judul }}
        </button>
      </div>
    </div>
 
    <!-- Progress Bar -->
    <div class="shrink-0 px-4 md:px-8 pt-3 pb-1 max-w-xl mx-auto w-full">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-white/40 text-xs">{{ completedCards.size }} / {{ currentKitab.bacaan.length }} selesai</span>
        <span class="text-jomud text-xs font-bold">{{ progress }}%</span>
      </div>
      <div class="h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          class="h-full bg-jomud rounded-full transition-all duration-500"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>
 
    <!-- Deskripsi Kitab -->
    <div class="shrink-0 px-4 md:px-8 pt-2 pb-3 max-w-xl mx-auto w-full">
      <p class="text-white/40 text-xs text-center italic">{{ currentKitab.deskripsi }}</p>
    </div>
 
    <!-- Scroll Area -->
    <main
      class="flex-1 overflow-y-auto px-4 md:px-8 pb-24 md:pb-8"
      style="touch-action: pan-y; -webkit-overflow-scrolling: touch"
    >
      <div class="max-w-xl mx-auto space-y-3">
        <TransitionGroup name="card">
          <div
            v-for="bacaan in currentKitab.bacaan"
            :key="bacaan.nomor"
            class="rounded-2xl border transition-all duration-300 overflow-hidden"
            :class="
              completedCards.has(bacaan.nomor)
                ? 'border-jomud/40 bg-jomud/5'
                : 'border-white/10 bg-black/20 backdrop-blur-sm'
            "
          >
            <!-- Card Header -->
            <div class="flex items-center justify-between px-4 pt-4 pb-2">
              <div class="flex items-center gap-2">
                <span
                  class="text-xs font-bold px-2 py-0.5 rounded-full"
                  :class="
                    completedCards.has(bacaan.nomor)
                      ? 'bg-jomud text-green-950'
                      : 'bg-white/10 text-white/50'
                  "
                >
                  {{ bacaan.nomor }}
                </span>
                <span class="text-white text-sm font-medium">{{ bacaan.judul }}</span>
              </div>
              <!-- Ulang badge -->
              <span
                v-if="bacaan.ulang > 1"
                class="text-xs text-white/40 border border-white/10 px-2 py-0.5 rounded-full"
              >
                {{ bacaan.ulang }}×
              </span>
            </div>
 
            <!-- Teks Arab -->
            <div class="px-4 pt-2 pb-3">
              <p
                class="text-right leading-loose text-white text-xl md:text-2xl"
                style="font-family: 'Amiri', serif; direction: rtl"
              >
                {{ bacaan.arab }}
              </p>
            </div>
 
            <!-- Latin Toggle -->
            <div class="px-4 pb-2">
              <button
                @click="toggleLatin(bacaan.nomor)"
                class="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                {{ showLatin[bacaan.nomor] ? '▾ Sembunyikan latin & terjemah' : '▸ Tampilkan latin & terjemah' }}
              </button>
              <Transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1"
              >
                <div v-if="showLatin[bacaan.nomor]" class="mt-2 space-y-1.5">
                  <p class="text-xs text-jomud/80 italic leading-relaxed">{{ bacaan.latin }}</p>
                  <p class="text-xs text-white/50 leading-relaxed border-t border-white/10 pt-1.5">{{ bacaan.terjemah }}</p>
                </div>
              </Transition>
            </div>
 
            <!-- Counter -->
            <div
              v-if="bacaan.ulang > 1"
              class="mx-4 mb-4 mt-1 flex items-center gap-3"
            >
              <!-- Progress dots (maks 10 ditampilkan) -->
              <div class="flex gap-1 flex-wrap flex-1">
                <div
                  v-for="i in Math.min(bacaan.ulang, 33)"
                  :key="i"
                  class="rounded-full transition-all duration-150"
                  :class="[
                    bacaan.ulang <= 10 ? 'size-2.5' : 'size-1.5',
                    i <= getCount(bacaan.nomor)
                      ? 'bg-jomud'
                      : 'bg-white/15'
                  ]"
                ></div>
              </div>
 
              <!-- Tap button -->
              <div class="flex items-center gap-2 shrink-0">
                <button
                  v-if="getCount(bacaan.nomor) > 0"
                  @click="resetCounter(bacaan.nomor)"
                  class="text-white/20 hover:text-white/50 text-xs transition-colors"
                >
                  ↺
                </button>
                <button
                  @click="tap(bacaan.nomor, bacaan.ulang)"
                  :disabled="completedCards.has(bacaan.nomor)"
                  class="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  :class="
                    completedCards.has(bacaan.nomor)
                      ? 'bg-jomud/20 text-jomud'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  "
                >
                  {{ completedCards.has(bacaan.nomor) ? '✓ Selesai' : `${getCount(bacaan.nomor)}/${bacaan.ulang}` }}
                </button>
              </div>
            </div>
 
            <!-- Sekali baca: mark done button -->
            <div v-else class="px-4 mb-4 mt-1 flex justify-end">
              <button
                @click="completedCards.has(bacaan.nomor) ? resetCounter(bacaan.nomor) : completedCards = new Set([...completedCards, bacaan.nomor])"
                class="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95"
                :class="
                  completedCards.has(bacaan.nomor)
                    ? 'bg-jomud/20 text-jomud'
                    : 'bg-white/10 text-white hover:bg-white/20'
                "
              >
                {{ completedCards.has(bacaan.nomor) ? '✓ Selesai' : 'Tandai selesai' }}
              </button>
            </div>
          </div>
        </TransitionGroup>
 
        <!-- Selesai semua -->
        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div
            v-if="progress === 100"
            class="text-center py-8 space-y-2"
          >
            <div class="text-3xl">✦</div>
            <p class="text-jomud font-bold text-sm tracking-widest uppercase">Alhamdulillah</p>
            <p class="text-white/40 text-xs">{{ currentKitab.judul }} selesai dibaca</p>
          </div>
        </Transition>
      </div>
    </main>
  </div>
</template>
 
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
 
main::-webkit-scrollbar { width: 4px; }
main::-webkit-scrollbar-track { background: transparent; }
main::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 999px; }
main::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
 
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease;
}
.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>