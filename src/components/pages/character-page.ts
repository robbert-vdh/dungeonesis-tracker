import Vue from 'vue'
import Component from 'vue-class-component'

import { Character } from '../../store';

// TypeScript does not allow decorators to add properties, so we need to somehow
// work around this
interface Shim {
  id: number
}

@Component({
  props: {
    id: Number
  },
})
export default class CharacterPage extends Vue {
  get character(): Character {
    return this.$store.state.characters[(<Shim><any>this).id];
  }
}
