<template>
  <Extension />
</template>

<script>

    import Extension from './components/Extension';
    import storage from './shared/storage';
    import regKeyAuth from './shared/regkey';
    import { globalStore } from './main';

        
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
    /* this.localStorage = storage;
    this.auth = regKeyAuth.auth; */
    //this.getRegKey();
  },

  mounted() { 
    this.$nextTick(function () {
      this.getRegKey()
    })
  },

  methods: {
    async getRegKey(){
      /* this.regKey = await this.localStorage.get('regKey');
      if(this.regKey) {
        globalStore.store.account = await this.auth(this.regKey)
      } */
      //console.log(globalStore);
      globalStore.store.account = {
        client: "My Test Company",
        isAdmin: 1,
        registratonKey: "sup_61b589b5f03c42.30439098",
        repositoryServer: "http://127.0.0.1:8000/api/",
        token: "$5$rounds=5000mzcHt$YZZLVq4ssfOss/w5F5O3rxDIhcKwTwQzI9f86Kow2i."
      }
    }
  }
};
</script>



