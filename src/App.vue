<template>
  <Extension />
</template>

<script>

    import Extension from './components/Extension';
    import storage from './shared/storage';
    import regKeyAuthentication from './shared/regkey';
    import { globalStore } from './main';
    import eventBus from './eventBus'
        
export default {
  name: "App",

  components: {
    Extension,
  },

  data() {
    return {
      regKey: '',
      account: {}
    }
  },

  created() { 
    this.localStorage = storage;
    this.auth = regKeyAuthentication.auth;
    //this.fakeGetkey();
    this.getRegKey();
    this.getUserFromLocal();
  },

  watch: {

  },

  methods: {
    async getRegKey(){
      this.regKey = await this.localStorage.get('regKey');
      if(this.regKey) {
        globalStore.store.account = await this.auth(this.regKey);
        //globalStore.store.projects = await this.getProjects(globalStore.store.account.token);
        eventBus.$emit('account-loaded')
      }
    },

    async getUserFromLocal() {
        const user = await this.localStorage.get('user');
        if (user) {
          this.user = JSON.parse(user);
          globalStore.store.user = this.user;
          eventBus.$emit('user-loaded')
        }
    },

    fakeGetkey(){
      setTimeout(()=>{
        globalStore.store.account = {
          client: "My Test Company",
          isAdmin: 1,
          registrationKey: "sup_61b589b5f03c42.30439098",
          repositoryServer: "http://127.0.0.1:8000/api/",
          token: "$5$rounds=5000mzcHt$YZZLVq4ssfOss/w5F5O3rxDIhcKwTwQzI9f86Kow2i.",
        };
        globalStore.store.projects = [
          {
            id: 1,
            label: 'bu senlarga',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.'
          },
          {
            id: 2,
            label: 'tralivali',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.'
          },
          {
            id: 3,
            label: 'emas',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.'
          },
          {
            id: 4,
            label: 'tilitili',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.'
          },
          {
            id: 5,
            label: 'bubblegum',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.'
          },
        ]
        eventBus.$emit('account-loaded')
      }, 2000)
    }
  }
};
</script>



