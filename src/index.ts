import Vue from "vue";
import Component from "vue-class-component";
import VueRouter from "vue-router";
import BootstrapVue from "bootstrap-vue";

import "./styles/app.scss";
import { store } from "./store";
import Router from "./components/main.vue";
import OverviewPage from "./components/pages/overview-page.vue";
import CharacterPage from "./components/pages/character-page.vue";

// TODO: Add an undo button

if (document.getElementById("app")) {
  Vue.use(BootstrapVue);
  Vue.use(VueRouter);

  Component.registerHooks([
    "beforeRouteEnter",
    "beforeRouteLeave",
    "beforeRouteUpdate"
  ]);

  const router = new VueRouter({
    routes: [
      { path: "/", component: OverviewPage, name: "overview" },
      {
        path: "/:id",
        component: CharacterPage,
        props: route => ({
          characterId: Number(route.params.id)
        }),
        name: "detail"
      },
      { path: "*", redirect: "/" }
    ]
  });

  new Router({ router, store }).$mount("#app");
}
