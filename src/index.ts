import axios from "axios";
import Vue from "vue";
import VueRouter from "vue-router";
import BootstrapVue from "bootstrap-vue";

import "./styles/app.scss";
import { store } from "./store";
import Router from "./components/main.vue";
import OverviewPage from "./components/pages/overview-page.vue";
import CharacterPage from "./components/pages/character-page.vue";

if (document.getElementById("app")) {
  Vue.use(BootstrapVue);
  Vue.use(VueRouter);

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

  const vm = new Router({ router, store }).$mount("#app");

  // We keep track of the amount of requests running in the background so we can
  // show a spinner to indicate that there are still requests being processed
  axios.interceptors.request.use(function(request) {
    vm.$store.commit("startRequest");

    return request;
  });
  axios.interceptors.response.use(
    function(response) {
      vm.$store.commit("finishRequest");

      return response;
    },
    function(error) {
      vm.$store.commit("finishRequest");

      // Show a toast notification when API requests fail. This should only happen
      // when the player tries to spend too much stars on a character.
      const data = error.response.data;
      console.log(data);
      if (data.detail !== undefined) {
        vm.$bvToast.toast(data.detail, {
          title: "Something went wrong",
          variant: "danger",
          autoHideDelay: 4000
        });
      }

      // Rethrow the error so that we don't make client side changes we are not
      // supposed to make
      throw error;
    }
  );
}
