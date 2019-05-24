import Vue from 'vue'
import { mapState } from 'vuex';
import Component from 'vue-class-component'

@Component({ computed: mapState(['characters']) })
export default class Overview extends Vue { }
