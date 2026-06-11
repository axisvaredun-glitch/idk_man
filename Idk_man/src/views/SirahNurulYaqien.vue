<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
    <div>
        <button
      @click="router.push('/')"
      class="absolute top-4 left-4 z-50 text-white bg-black/30 hover:bg-slate-600 hover:opacity-80 px-4 py-2 rounded-full text-sm backdrop-blur-sm"
    >
      ← Back
    </button>
    
    
    </div>
</template>