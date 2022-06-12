<template>
    
    <div class="ui-br-ext-settings-body">
        <div class="ui-br-ext-btn-link ui-br-ext-btn-create-project">
            <span id="ui-br-ext-btn-link" @click="showAddKey = !showAddKey;" :class="{active: showAddKey}">Sign in</span>  
        </div>
        <ul class="ui-br-ext-info-list" v-if="!showAddKey">
            <div class="ui-br-ext-spacer-1"></div>
            <li v-if="account && account.email && !showConfirmationMessage">
                <span><strong>Email:</strong> </span><br><span>  {{account.email}}</span>
            </li >
            <li v-if="showConfirmationMessage">
                <span><strong>Verify your email</strong></span>
            </li>
            <div class="ui-br-ext-spacer-1"></div>
        </ul >
        <div v-if="showAddKey">
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="regKey">License Key</label>
                <input type="text" name="regKey" v-model="regKey"/>
                <span class="ui-br-ext-message">{{keyError}}</span>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="email">Email</label>
                <input type="email" name="email" v-model="email"/>
                <span class="ui-br-ext-message">{{emailError}}</span>
            </div>
            <button class="ui-br-ext-btn" id="ui-br-ext-save-new-module" data-listener="off" :disabled="spinner" :class="{ disabled: spinner }">
                <span class="ui-br-ext-spinner" :class="{ active: spinner }"></span>
                <span @click="onRegKeySave">Save</span > 
            </button>
        </div>
    </div>
    
</template>


<script>

    import { v4 as uuidv4 } from 'uuid';
    import { globalStore } from './../../../main';
    import authService from '../../../services/auth.service';
    import storage from './../../../common/storage';
    import eventBus from './../../../eventBus';

    export default {
        name: 'Account',
        
        created() { 
            this.auth = authService.auth,
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
                regKey: '',
                keyError: '',
                email: '',
                emailError: '',
                spinner: false,
                showConfirmationMessage: false
            }
        },

        methods: {
            async onRegKeySave(){
                this.keyError = "";
                this.emailError = "";
                let count = 0;
                if (this.regKey.trim() == ''){ 
                    this.keyError = "License key is required";
                    count++;
                }
                if (this.email.trim() == ''){ 
                    this.emailError = "Email is required";
                    count++;
                } else {
                    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email))) {
                        this.emailError = 'Please enter a valid email address';
                        count++;
                    }
                }
                if( count > 0) return false;
                this.submit()
            },

            async submit(){
                const appId = uuidv4();
                this.spinner = true;
                const logData = {
                    regKey: this.regKey,
                    email: this.email,
                    appId: appId
                }
                try {
                    await this.auth(logData)
                    this.spinner = false;
                    globalStore.store.account = this.account;
                    eventBus.$emit('regkey-updated');
                    this.showAddKey = false;
                    this.showConfirmationMessage = true;
                    try {
                        await this.localStorage.set('regData', logData);
                    } catch(error) {
                        console.log(error);
                    }
                } catch (error) {
                    console.log(error);
                    eventBus.$emit('toggle-toast', { text: error, danger: true })
                    this.spinner = false;
                }
            },
        }
    }
</script>