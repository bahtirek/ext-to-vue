<template>
    
    <div class="ui-br-ext-settings-body">
        <ul class="ui-br-ext-info-list">
            <li v-if="account && account.registrationKey ">
                <span><strong>Regkey:</strong> </span><span>  {{account.registrationKey}}</span>
            </li >
        </ul >
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="regKey">Registration Key</label>
            <input type="text" name="regKey" v-model="reg.key"/>
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
    import regKeyAuth from './../../../common/regkey';
    import storage from './../../../common/storage';
    import eventBus from './../../../eventBus'

    export default {
        name: 'Account',
        
        created() { 
            this.auth = regKeyAuth.auth,
            this.localStorage = storage
        },

        mounted() {
            this.account = globalStore.store.account;
        },

        data() {
            return {
                account: {},
                isRegKeySaved: false,
                reg: {
                    key: '',
                    error: '',
                    spinner: false,
                }
            }
        },

        methods: {
            async onRegKeySave(){
                this.reg.error = "";
                if (this.reg.key !== ''){ 
                    if (this.account && this.account.registrationKey) {
                        let regKeyConfirmation = confirm('Do you want to change the registration key?');
                        if (!regKeyConfirmation) {
                            this.reg.key = '';
                            return false
                        }
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
        }
    }
</script>