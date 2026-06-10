// index.ts
import { createRouter, createWebHistory } from "vue-router"; // ← ini kurang!
import HomePage from "../views/HomePage.vue";
import TimePage from "../views/Time.vue";
import QuranPage from "../views/QuranPage.vue";
import SirahNurulYaqienPage from "../views/SirahNurulYaqien.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomePage },
    { path: "/time", component: TimePage },
    { path: "/quran", component: QuranPage },
    { path: "/nurul", component: SirahNurulYaqienPage }
  ],
});

export default router;