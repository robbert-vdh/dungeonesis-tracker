import './styles/app.scss';

import Overview from './components/overview.vue';

if (document.getElementById('app')) {
  new Overview({ el: '#app' });
}
