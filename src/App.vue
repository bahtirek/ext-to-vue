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
    this.getUserData();
    //this.fakeGetkey();
  },

  watch: {

  },

  /* 
    userData = {
      regKey: String,
      email: String,
      appId: String
    }
  */

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

    fakeGetkey(){
      const userData = {
        RegistrationKey: "sup_61b589b5f03c42.30439098",
        UserEmail: "uzsultanov@gmail.com",
        UserAppId: "a3a6120c-e3aa-4185-a664-53a1567b99e4"
      };
      this.login(userData);
    },

    async login(userData){
      console.log('login');
      try {
        const result = await this.auth(userData);
        console.log(result);
        globalStore.store.account = {...result, ...userData}
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



