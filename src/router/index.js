import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import SellerPage from "@/views/SellerPage";
import TrendPage from "@/views/TrendPage";
import MapPage from "@/views/MapPage";
import RankPage from "@/views/RankPage";
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
];

const router = new VueRouter({
  routes,
});

export default router;
