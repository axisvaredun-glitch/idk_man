// index.ts
import { createRouter, createWebHistory } from "vue-router"; // ← ini kurang!
import HomePage from "../views/HomePage.vue";
import TimePage from "../views/Time.vue";
import QuranPage from "../views/QuranPage.vue";
import DzikirPage from "../views/DzikirPage.vue";
import MosqueFinderPage from "../views/FindTheNearestMosque.vue";
import FeedBack from "../views/FeedBack.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomePage },
    { path: "/time", component: TimePage },
    { path: "/quran", component: QuranPage },
    { path: "/dzikir", component: DzikirPage },
    { path: "/mosque", component: MosqueFinderPage },
    { path: "/feedBack", component: FeedBack },
  ],
});

export default router;