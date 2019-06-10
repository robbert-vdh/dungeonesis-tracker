// Automatically reead from package.json through webpack's DefinePlugin
declare const CURRENT_VERSION: string;

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "*.md" {
  const contents: string;
  export default contents;
}

declare module "*.svg" {
  import Vue from "vue";
  export default Vue;
}

// Taken from
// https://github.com/bootstrap-vue/bootstrap-vue/blob/7da8e6571de372bb12f1b4fcd40872d48be765ca/src/components/dropdown/index.d.ts
// since the currently released version is missing typings
declare interface BDropdown extends Vue.default {
  show: () => void;
  hide: (refocus?: boolean) => void;
}
