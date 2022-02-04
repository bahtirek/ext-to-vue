<template>
  <Extension />
</template>

<script>

    import Extension from './components/Extension';
    import storage from './common/storage';
    import regKeyAuthentication from './common/regkey';
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
    this.fakeGetkey();
    /* this.getRegKey();
    this.getUserFromLocal();
    this.getProjectFromLocal(); */
  },

  watch: {

  },

  methods: {
    async getRegKey(){
      this.regKey = await this.localStorage.get('regKey');
      if(this.regKey) {
        globalStore.store.account = await this.auth(this.regKey);
        //globalStore.store.modules = await this.getmModules(globalStore.store.account.token);
        eventBus.$emit('account-loaded')
      }
    },

    async getUserFromLocal() {
        const user = await this.localStorage.get('user');
        if (user) {
          globalStore.store.user = JSON.parse(user);
        }
    },

    async getModuleFromLocal() {
        const module = await this.localStorage.get('module');
        if (module) {
          globalStore.store.currentModule = JSON.parse(module);
        }
    },

    async getProjectFromLocal() {
        const project = await this.localStorage.get('project');
        if (project) {
          globalStore.store.project = JSON.parse(project);
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

        globalStore.store.user = {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john_doe@gmail.com'
        };
        
        globalStore.store.project = {
          projectKey: 'EXTBR',
          jiraId: '1212',
          saveToJira: true
        };

        globalStore.store.currentModule = {
          id: 3,
          name: 'emas',
          description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.'
        };

        globalStore.store.modules = [
          {
            id: 1,
            name: 'bu senlarga',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.'
          },
          {
            id: 2,
            name: 'tralivali',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.'
          },
          {
            id: 3,
            name: 'emas',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.'
          },
          {
            id: 4,
            name: 'tilitili',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.'
          },
          {
            id: 5,
            name: 'bubblegum',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.'
          },
        ]
        eventBus.$emit('account-loaded')
      }, 2000)
    }
  }
};
</script>



