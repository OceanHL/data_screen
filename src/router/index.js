import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import SellerPage from "@/views/SellerPage";
import TrendPage from "@/views/TrendPage";
import MapPage from "@/views/MapPage";
import RankPage from "@/views/RankPage";
import HotPage from "@/views/HotPage";
import StockPage from "@/views/StockPage";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/sellerpage",
    component: SellerPage,
  },
  {
    path: "/trendpage",
    component: TrendPage,
  },
  {
    path: "/mappage",
    component: MapPage,
  },
  {
    path: "/rankpage",
    component: RankPage,
  },
  {
    path: "/hotpage",
    component: HotPage,
  },
  {
    path: "/stockpage",
    component: StockPage,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
