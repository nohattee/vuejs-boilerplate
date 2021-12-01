import Vue from "vue";
import VueRouter from "vue-router";
import AdminLayout from "@/layouts/AdminLayout";

import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
    meta: { title: "Login", icon: "login", affix: true },
  },
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
        path: "purchased-item",
        name: "PurchasedItem",
        component: () => import("@/views/PurchasedItem.vue"),
        meta: { title: "Purchased Item", icon: "purchased-item", affix: true },
      },
    ],
  },
  {
    path: "/cms",
    redirect: { name: "Post" },
    component: AdminLayout,
    children: [
      {
        path: "post",
        name: "Post",
        component: () => import("@/views/CMS/Post.vue"),
        meta: { title: "Post", icon: "post", affix: true },
      },
      {
        path: "category",
        name: "Post Category",
        component: () => import("@/views/CMS/Category.vue"),
        meta: { title: "Post Category", icon: "post-category", affix: true },
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

router.beforeEach((to, from, next) => {
  const token = store.state.currentUser.token;
  if (token) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    if (to.path === "/login") {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  }
});

export default router;
