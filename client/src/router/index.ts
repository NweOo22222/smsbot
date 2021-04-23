import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("../views/Users.vue"),
  },
  {
    path: "/users/:id",
    name: "User",
    component: () => import("../views/User.vue"),
  },
  {
    path: "/highlights",
    name: "Highlights",
    component: () => import("../views/Highlights.vue"),
  },
  {
    path: "/highlights/create",
    name: "AddHighlights",
    component: () => import("../views/AddHighlights.vue"),
  },
  {
    path: "/articles",
    name: "Articles",
    component: () => import("../views/Articles.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
