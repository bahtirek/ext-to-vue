<template>
  <Extension />
</template>

<script>

    import Extension from './components/Extension';
    import storage from './shared/storage';
    import regKeyAuth from './shared/regkey';
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
      account: {
        /* client: "My Test Company",
        isAdmin: 0,
        registratonKey: "sup_61b589b5f03c42.30439098",
        repositoryServer: "http://127.0.0.1:8000/api/",
        token: "$5$rounds=5000mzcHt$YZZLVq4ssfOss/w5F5O3rxDIhcKwTwQzI9f86Kow2i." */
      }
    }
  },

  created() { 
    /* this.localStorage = storage;
    this.auth = regKeyAuth.auth; */
    this.getRegKey();
  },

  watch: {

  },

  mounted() { 
    //this.getRegKey()
    this.$nextTick(function () {
    })
  },

  methods: {
    async getRegKey(){
      /* this.regKey = await this.localStorage.get('regKey');
      if(this.regKey) {
        globalStore.store.account = await this.auth(this.regKey)
      } */
      //console.log(globalStore);
      setTimeout(()=>{
        globalStore.store.account = {
          client: "My Test Company",
          isAdmin: 1,
          registratonKey: "sup_61b589b5f03c42.30439098",
          repositoryServer: "http://127.0.0.1:8000/api/",
          token: "$5$rounds=5000mzcHt$YZZLVq4ssfOss/w5F5O3rxDIhcKwTwQzI9f86Kow2i.",
          projects: [
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
        }
        eventBus.$emit('account-loaded')
      }, 2000)
    }
  }
};
</script>



