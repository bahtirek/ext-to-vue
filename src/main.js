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
      globalSettings: {
        saveToDb: true
      },
      selectedElement: '',
      currentElementInlineStyle: '',
      selectedElementRect: '',
      account: {},
      bugId: undefined,
      xpath: '',
      activeBugElement: undefined,
      activeBugCover: undefined,
      project: {
        projectKey: '',
        jiraId: '', 
        saveToJira: false,
      },
      modules: [],
      user: {},
      dynamicDomFlow: false,
      currentModule: {},
      screenshot: '',
      reports: [],
      report: {
        description: '',
        actualResult: '',
        expectedResult: '',
        stepsToReproduce: '',
        saveJira: false,
        savePdf: false,
        saveScreenshot: false,
        xpath: '',
        screenshot: '',
        url:'',
        queryWidth: 550,
        user: undefined
      },
      reportBug: {
        module: {},
        environment: {},
        project: {}
      },
      reviewBug: {
        module: {},
        environment: {},
        project: {},
        from: '',
        to: ''
      },
    }
  }
})
