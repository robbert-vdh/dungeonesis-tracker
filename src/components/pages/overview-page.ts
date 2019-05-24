import Vue from 'vue'
import Component from 'vue-class-component'
import { mapState } from 'vuex';

@Component({ computed: mapState(['characters']) })
export default class OverviewPage extends Vue { }
