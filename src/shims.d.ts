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
