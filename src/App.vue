<template>
  <Extension />
</template>

<script>

    import Extension from './components/Extension';
    import storage from './common/storage';
    import authService from './services/auth.service';
    import { globalStore } from './main';
    import eventBus from './eventBus';
        
export default {
  name: "App",

  components: {
    Extension
  },

  data() {
    return {
      userData: '',
      account: {}
    }
  },

  created() { 
    this.localStorage = storage;
    this.auth = authService.auth;
    this.getUserData();
    //this.adminUserAuth();
    //this.regularUserAuth();
  },

  methods: {
    async getUserData(){
      try {
        const userData = await this.localStorage.get('userData')
        this.login(userData)
        this.checkSavedBug()
      } catch (error) {
        console.log(error);
      }
    },

    adminUserAuth(){
      const userData = {
        registrationKey: "61b589b5f03c42.30439098",
        userEmail: "uzsultanov@gmail.com",
        userAppId: "a3a6120c-e3aa-4185-a664-53a1567b99e4"
      };
      this.login(userData);
    },
    regularUserAuth(){
      const userData = {
        registrationKey: "61b589b5f03c42.30439098",
        userEmail: "bahti005@gmail.com",
        userAppId: "a3a6120c-e3aa-4185-a664-53a1567b99e4"
      };
      this.login(userData);
    },

    async login(userData){
      if(!userData) return false;
      try {
        const result = await this.auth(userData);
        globalStore.store.account = {...userData, ...result}
        await this.localStorage.set('userData', userData);
        eventBus.$emit('account-loaded')
      } catch(error) {
        console.log(error);
        eventBus.$emit('toggle-toast', { text: error, danger: true })
      }
    },

    checkSavedBug(){
      const storageItem = window.localStorage.getItem('ezBugSavedReport');
      if(storageItem != null) {
        const savedBug = JSON.parse(storageItem);
        if(savedBug.xpath) {
          this.setSavedBug(savedBug)
        }
      }
    },

    setSavedBug(savedBug){
      const reportBugBtn = document.getElementById('ui-br-ext-report-bug-button');
      reportBugBtn.classList.remove('ui-br-ext-report-bug-inactive');
      let element;
      try {
          element = document.evaluate(savedBug.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
          if(element) {
            globalStore.store.selectedElement = element
            reportBugBtn.click();
          }
      } catch(e) {
          console.log(e)
      }
    }
  }
};
</script>



