<template>
    
        <div class="ui-br-ext-setting-body">
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="regKey">Registration Key</label>
                <input type="text" name="regKey" v-model="reg.key" :placeholder="reg.placeholder"/>
                <span class="ui-br-ext-message">{{reg.error}}</span>
            </div>
            <button class="ui-br-ext-btn" id="ui-br-ext-save-new-project" data-listener="off">
                <span class="ui-br-ext-spinner" :class="{ active: reg.spinner }"></span>
                <span @click="onRegKeySave">Save</span > 
            </button>
        </div>
    
</template>


<script>

    import { globalStore } from './../../../main';
    import regKeyAuth from './../../../shared/regkey';
    import storage from './../../../shared/storage';

    export default {
        name: 'Account',
        
        created() { 
            this.auth = regKeyAuth.auth,
            this.localStorage = storage
        },

        mounted() { 
            this.$nextTick(function () {
                console.log(globalStore.store);
                if(globalStore.store.account) this.account = globalStore.store.account
            })
        },

        watch: { 
            isRegKeySaved: function(newVal, prevVal) { // watches if reg key saved to local
                this.reg.spinner = false
            }
        },

        data() {
            return {
                account: {},
                isRegKeySaved: false,
                reg: {
                    key: '',
                    error: '',
                    spinner: false,
                    placeholder: '***_**********************',
                }
            }
        },

        methods: {
            async onRegKeySave(){
                this.reg.error = "";
                if (this.reg.key !== ''){ 
                    this.reg.spinner = true;
                    this.account = await this.auth(this.reg.key)
                        .catch(error => {
                            this.reg.error = error;
                            this.reg.spinner = false;
                        });
                    if(this.accountData) {
                        this.localStorage.set('regKey', this.reg.key)
                        this.isRegKeySaved = this.localStorage.get('regKey');
                    }
                } else {
                    this.reg.error = "Enter registration key";
                    this.reg.spinner = false
                }
            },
        }
    }
</script>