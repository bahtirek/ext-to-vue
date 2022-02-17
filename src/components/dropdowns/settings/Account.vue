<template>
    
    <div class="ui-br-ext-settings-body">
        <div class="ui-br-ext-btn-link ui-br-ext-btn-create-project">
            <span id="ui-br-ext-btn-link" @click="showAddKey = !showAddKey;" :class="{active: showAddKey}">Add license key</span>  
        </div>
        <ul class="ui-br-ext-info-list" v-if="!showAddKey">
            <div class="ui-br-ext-spacer-1"></div>
            <li v-if="account && account.registrationKey ">
                <span><strong>Regkey:</strong> </span><span>  {{account.registrationKey}}</span>
            </li >
            <div class="ui-br-ext-spacer-1"></div>
        </ul >
        <div v-if="showAddKey">
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
    </div>
    
</template>


<script>

    import { globalStore } from './../../../main';
    import regKeyAuth from './../../../services/regkey.service';
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
                showAddKey: false,
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
                if (this.reg.key.trim() !== ''){ 
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
                        this.showAddKey = false;
                    }
                } else {
                    this.reg.error = "Enter registration key";
                    this.reg.spinner = false
                }
            },
        }
    }
</script>