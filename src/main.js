import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

var uibrextInstance = new Vue({
  render: (h) => h(App),
}).$mount("#ui-br-ext-extension-container");

//Destroys extension instance and removes from dom
window.destroyeUibrextInstance = function() {
  const extEl = document.getElementById('ui-br-ext-extension');
  extEl.remove();
  uibrextInstance.$destroy();
}

export const globalStore = new Vue({
  data: {
    store: {
      selectedElement: '',
      currentElementInlineStyle: '',
      selectedElementRect: '',
      account: {},
      projects: [],
      user: {},
      dynamicDomFlow: false,
      currentProject: {},
      screenshot: '',
      report: {
        description: '',
        actualResults: '',
        expectedResults: '',
        stepsToReproduce: '',
        saveJira: false,
        savePdf: false,
        saveScreenshot: false,
        xPath: '',
    }
    }
  }
})
