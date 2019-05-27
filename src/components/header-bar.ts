import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

@Component({
  computed: mapState(["user"])
})
export default class HeaderBar extends Vue {}
