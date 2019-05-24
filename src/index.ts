import Vue from 'vue';
import VueRouter from 'vue-router';

import './styles/app.scss';
import { store } from './store';
import Router from './components/router.vue';
import Overview from './components/routes/overview.vue';

// TODO: Add an undo button

if (document.getElementById('app')) {
  Vue.use(VueRouter);

  const router = new VueRouter({
    routes: [
      { path: '/', component: Overview },
      { path: '*', redirect: '/' }
    ]
  });

  new Router({ router, store }).$mount('#app');
}
