<template>
  <Extension/>
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
      regKey: ''
    }
  },

  watch: {
    regKey: async function(val) {
      console.log('line28', val);
      console.log('line29', this.regKey);
      globalStore.store.account = await this.auth(val)
      console.log(globalStore.store);
    }
  },

  created() { 
    this.localStorage = storage;
    this.auth = regKeyAuth.auth;
    this.getRegKey();
  },

  methods: {
    getRegKey(){
      this.regKey = this.localStorage.get('regKey');
      console.log('line44', this.regKey)
    }
  }
};
</script>



