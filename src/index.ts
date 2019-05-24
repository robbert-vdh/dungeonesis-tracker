import Vue from 'vue';
import VueRouter from 'vue-router';

import './styles/app.scss';
import { store } from './store';
import Router from './components/router.vue';
import OverviewPage from './components/pages/overview-page.vue';
import CharacterPage from './components/pages/character-page.vue';

// TODO: Add an undo button

if (document.getElementById('app')) {
  Vue.use(VueRouter);

  const router = new VueRouter({
    routes: [
      { path: '/', component: OverviewPage },
      { path: '/:id', component: CharacterPage, props: true },
      { path: '*', redirect: '/' }
    ]
  });

  new Router({ router, store }).$mount('#app');
}
