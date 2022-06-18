<template>
  <Extension />
</template>

<script>

    import Extension from './components/Extension';
    import storage from './common/storage';
    import authService from './services/auth.service';
    import { globalStore } from './main';
    import eventBus from './eventBus'
        
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
    //this.getUserData();
    this.adminUserAuth();
    //this.regularUserAuth();
  },

  methods: {
    async getUserData(){
      console.log('getuser');
      try {
        const userData = await this.localStorage.get('userData')
        this.login(userData)
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
      console.log('login');
      try {
        const result = await this.auth(userData);
        console.log(result);
        globalStore.store.account = {...userData, ...result}
        await this.localStorage.set('userData', userData);
        eventBus.$emit('account-loaded')
      } catch(error) {
        console.log(error);
        eventBus.$emit('toggle-toast', { text: error, danger: true })
      }
    }
  }
};
</script>



