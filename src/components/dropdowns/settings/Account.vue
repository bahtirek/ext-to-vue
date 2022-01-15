<template>
    
    <div class="ui-br-ext-settings-body">
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="regKey">Registration Key</label>
            <input type="text" name="regKey" v-model="reg.key" :placeholder="reg.placeholder"/>
            <span class="ui-br-ext-message">{{reg.error}}</span>
        </div>
        <button class="ui-br-ext-btn" id="ui-br-ext-save-new-module" data-listener="off">
            <span class="ui-br-ext-spinner" :class="{ active: reg.spinner }"></span>
            <span @click="onRegKeySave">Save</span > 
        </button>
    </div>
    
</template>


<script>

    import { globalStore } from './../../../main';
    import regKeyAuth from './../../../shared/regkey';
    import storage from './../../../shared/storage';
    import eventBus from './../../../eventBus'

    export default {
        name: 'Account',
        
        created() { 
            this.auth = regKeyAuth.auth,
            this.localStorage = storage
        },

        mounted() {
            this.account = globalStore.store.account;
            this.updatePlaceholder()
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
                    if (this.account && this.account.registrationKey) {
                        let regKeyConfirmation = confirm('Do you want to change the registration key?');
                        if (!regKeyConfirmation) return false;
                    }
                    this.reg.spinner = true;
                    // Get request
                    this.account = await this.auth(this.reg.key)
                        .catch(error => {
                            this.reg.error = error;
                            this.reg.spinner = false;
                        });
                    if(this.account) {
                        globalStore.store.account = this.account;
                        eventBus.$emit('account-loaded');
                        await this.localStorage.set('regKey', this.reg.key);
                        this.reg.spinner = false;
                    }
                } else {
                    this.reg.error = "Enter registration key";
                    this.reg.spinner = false
                }
            },
            
            updatePlaceholder() {
                if(this.account) {
                    console.log(JSON.parse(JSON.stringify(this.account)));
                    if (this.account.isAdmin == 1 ){
                        this.reg.placeholder = 'sup_**********************'
                    } else {
                        this.reg.placeholder = 'reg_**********************'
                    }
                }
            }
        }
    }
</script>