import Vue from 'vue'
import VueRouter from 'vue-router'

import './styles/app.scss';
import Router from './components/router.vue';
import Overview from './components/routes/overview.vue';

if (document.getElementById('app')) {
  Vue.use(VueRouter);

  const router = new VueRouter({
    routes: [
      { path: '/', component: Overview },
      { path: '*', redirect: '/' }
    ]
  });

  new Router({ router }).$mount('#app');
}
