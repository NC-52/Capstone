import Vue from "vue";
import VueRouter from "vue-router";

import LogoList from "../views/Logos/LogoList.vue";
import CreateLogo from "../views/Logos/CreateLogo.vue";
import EditLogo from "../views/Logos/EditLogo.vue";

import { authGuard } from "../auth/authGuard";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "logos",
    component: LogoList
  },
  {
    path: "/create",
    name: "create-logo",
    component: CreateLogo,
    beforeEnter: authGuard
  },
  {
    path: "/:logo/edit",
    name: "edit-logo",
    component: EditLogo,
    beforeEnter: authGuard
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
