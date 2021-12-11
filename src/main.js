import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#ui-br-ext-extension-container");

export const globalStore = new Vue({
  data: {
    globalVar: {
      selectedElement: '',
      currentElementInlineStyle: '',
      selectedElementRect: ''
    }
  }
})
