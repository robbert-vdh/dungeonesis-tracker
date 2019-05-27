import Vue from "vue";
import Component from "vue-class-component";
import { mapGetters, mapState } from "vuex";

import * as utils from "../../utils";
import CharacterList from "../character-list.vue";

@Component({ components: { "character-list": CharacterList } })
export default class OverviewPage extends Vue {}
