import Vue from "vue";
import VueRouter from "vue-router";
import AdminLayout from "../layouts/AdminLayout.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: { name: "Dashboard" },
    component: AdminLayout,
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: { title: "Dashboard", icon: "dashboard", affix: true },
      },
      {
        path: "user",
        name: "User",
        component: () => import("@/views/User.vue"),
        meta: { title: "User", icon: "user", affix: true },
      },
      {
        path: "post",
        name: "Post",
        component: () => import("@/views/Post.vue"),
        meta: { title: "Post", icon: "post", affix: true },
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
