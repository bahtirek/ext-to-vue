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
      regData: '',
      account: {}
    }
  },

  created() { 
    this.localStorage = storage;
    this.auth = authService.auth;
    //this.fakeGetkey();
    this.getregData();
    //this.getUserFromLocal();
    //this.getProjectFromLocal();
    //this.getModuleFromLocal();
  },

  watch: {

  },

  methods: {
    async getregData(){
      const regData = await this.localStorage.get('regData');
      if(regData) {
        try {
          const result = await this.auth(regData);
          globalStore.store.account = {...result, ...regData}
          eventBus.$emit('account-loaded')
        } catch(error) {
          console.log(error);
        }
        
      }
    },

    /* async getUserFromLocal() {
        const user = await this.localStorage.get('user');
        if (user) {
          globalStore.store.user = JSON.parse(user);
        }
    }, */

   /*  async getModuleFromLocal() {
        const module = await this.localStorage.get('module');
        if (module) {
          globalStore.store.currentModule = JSON.parse(module);
        }
    }, */

/*     async getProjectFromLocal() {
        const project = await this.localStorage.get('project');
        if (project) {
          globalStore.store.project = JSON.parse(project);
        }
    }, */

    async fakeGetkey(){
      const regData = 'sup_61b589b5f03c42.30439098';
      globalStore.store.account = await this.auth(regData);
      console.log(globalStore.store.account)
      setTimeout(()=>{
        
    
        globalStore.store.user = {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john_doe@gmail.com'
        };
        
        globalStore.store.project = {
          allowDelete: 0,
          clientId: 2,
          created_at: "2022-03-24T00:24:37.000000Z",
          id: 2,
          jiraId: null,
          lkProjectStatusId: 1,
          projectKey: "bugtest",
          saveToJira: 0,
          updated_at: "2022-03-24T00:24:37.000000Z",
        };

        globalStore.store.currentModule = {
          moduleId: 2,
          name: "bugtest edited",
          allowDelete: 0,
          description: "bugtest edited"
        };
        eventBus.$emit('account-loaded')
      }, 2000)
    }
  }
};
</script>



