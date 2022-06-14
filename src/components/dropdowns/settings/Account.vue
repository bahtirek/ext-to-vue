<template>
    
    <div class="ui-br-ext-settings-body">
        <div class="ui-br-ext-btn-link ui-br-ext-btn-create-project">
            <span id="ui-br-ext-btn-link" @click="toggleView" :class="{active: showAddKey}">Sign in</span>  
        </div>
        <ul class="ui-br-ext-info-list" v-if="!showAddKey">
            <div class="ui-br-ext-spacer-1"></div>
            <li v-if="account && account.email && !showConfirmationMessage">
                <span><strong>Email:</strong> </span><br><span>  {{account.email}}</span>
            </li >
            <li v-if="showConfirmationMessage">
                <span>Check your email for the confirmation code</span>
            </li>
            <div class="ui-br-ext-spacer-1"></div>
        </ul >
        <div v-if="showConfirmationMessage">
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="regKey">Confirmation code</label>
                <input type="text" name="regKey" v-model="confirmationCode"/>
                <span class="ui-br-ext-message">{{confirmationCodeError}}</span>
            </div>
            <button class="ui-br-ext-btn" id="ui-br-ext-save-new-module" data-listener="off" :disabled="spinner" :class="{ disabled: spinner }">
                <span class="ui-br-ext-spinner" :class="{ active: spinner }"></span>
                <span @click="confirm">Confirm</span > 
            </button>
        </div>
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
            this.auth = authService.auth;
            this.verify = authService.verifyCode;
            this.localStorage = storage;
        },

        mounted() {
            this.account = globalStore.store.account;
            this.checkTempData();
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
                showConfirmationMessage: false,
                confirmationCode: '',
                confirmationCodeError: '',
                appId: '',
                validateConfirmationCode: '',
                tempData: undefined
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
                this.appId = uuidv4();
                this.spinner = true;
                const logData = {
                    regKey: this.regKey,
                    email: this.email,
                    appId: this.appId,
                    date: Date.now()
                }
                try {
                    await this.auth(logData)
                    this.showConfirmationMessage = true;
                    try {
                        await this.localStorage.set('tempUserData', logData);
                    } catch(error) {
                        console.log(error);
                    }
                    this.spinner = false;
                    this.showAddKey = false;
                } catch (error) {
                    console.log(error);
                    eventBus.$emit('toggle-toast', { text: error, danger: true })
                    this.spinner = false;
                }
            },

            async confirm(){
                if(!this.validateCode()) return false;
                this.spinner = true;
                try {
                    await this.verify(this.validateConfirmationCode, this.appId)                
                } catch(error) {
                    if(error.result.message) {
                        eventBus.$emit('toggle-toast', { text: error.result.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }
                }
                this.spinner = false;
            },

            validateCode(){
                this.confirmationCodeError = "";
                let confirmationCode = this.confirmationCode.trim();
                confirmationCode = confirmationCode.replace(/\D/g,'');
                if(confirmationCode && confirmationCode.length == 6){
                    this.validateConfirmationCode = confirmationCode;
                    return true;
                } else {
                    this.confirmationCodeError = 'Confirmation code is inocrrect';
                    return false;
                }
            },

            async checkTempData(){
                /* If confirmation code sent and not confirmed */
                if(this.account && this.account.email) return false;
                try {
                    this.tempData = await this.localStorage.get('tempUserData');
                    const hours = (Date.now() - this.tempData.date) / (60 * 60 * 1000);
                    if(hours < 24) {this.showConfirmationMessage = true}
                } catch(error) {
                    console.log(error);
                }
            },

            toggleView(){
                this.showAddKey = !this.showAddKey;
                this.showConfirmationMessage = false;
            }
        }
    }
</script>