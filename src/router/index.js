import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Admin from "@/views/Admin.vue";
import AdminLogin from "@/views/AdminLogin.vue";
import VideoDetail from "@/views/VideoDetail.vue";
import Register from "@/views/Register.vue";
import UserManagement from "@/views/admin/UserManagement.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "Bilibili图片分享" },
  },
  {
    path: "/video/:id",
    name: "VideoDetail",
    component: VideoDetail,
    meta: { title: "视频详情" },
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: AdminLogin,
    meta: { title: "管理员登录" },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { title: "用户注册" },
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: { title: "管理后台", requiresAuth: true },
    redirect: "/admin/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/admin/Dashboard.vue"),
        meta: { title: "仪表盘", requiresAuth: true },
      },
      {
        path: "images",
        name: "ImageManagement",
        component: () => import("@/views/admin/ImageManagement.vue"),
        meta: { title: "图片管理", requiresAuth: true },
      },
      {
        path: "categories",
        name: "CategoryManagement",
        component: () => import("@/views/admin/CategoryManagement.vue"),
        meta: { title: "分类管理", requiresAuth: true },
      },
      {
        path: "users",
        name: "UserManagement",
        component: UserManagement,
        meta: { title: "用户管理", requiresAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Bilibili图片分享平台";

  const isAdmin = localStorage.getItem("isAdmin");
  const token = localStorage.getItem("token");
  const isLoggedIn = isAdmin && token;

  // 如果已登录且访问登录页面，重定向到管理后台
  if (to.name === "AdminLogin" && isLoggedIn) {
    next("/admin");
    return;
  }

  // 检查是否需要管理员权限
  if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      next("/admin/login");
      return;
    }
  }

  next();
});

export default router;
