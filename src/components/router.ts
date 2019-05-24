import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
export default class Main extends Vue {
  created() {
    this.$store.dispatch('fetchCharacters');
  }
}
