<template>
    
    <div class="ui-br-ext-settings-body">
        <div class="ui-br-ext-btn-link ui-br-ext-btn-create-project">
            <span id="ui-br-ext-btn-link" @click="toggleView" :class="{active: showAddKey}" v-if="!(this.account && this.account.token)">Sign in</span>  
        </div>
        <ul class="ui-br-ext-info-list" v-if="this.account && this.account.token">
            <li>
                <span><strong>Logged user:</strong> </span><span>  {{account.userEmail}}</span>
            </li >
        </ul >
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
                <input type="text"  autocomplete="off"  name="regKey" v-model="confirmationCode"/>
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
                <input type="text"  autocomplete="off"  name="regKey" v-model="regKey"/>
                <span class="ui-br-ext-message">{{keyError}}</span>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="email">Email</label>
                <input type="email"  autocomplete="off" name="email" v-model="email"/>
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
                tempData: undefined,
                userData: {}
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
                this.userData = {
                    registrationKey: this.regKey,
                    userEmail: this.email,
                    userAppId: this.appId,
                    date: Date.now()
                }
                try {
                    await this.auth(this.userData)
                    this.showConfirmationMessage = true;
                    try {
                        await this.localStorage.set('tempUserData', this.userData);
                        await this.localStorage.remove('userData');
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
                //if(!this.validateCode()) return false;
                this.spinner = true;
                try {
                    this.account = await this.verify(this.confirmationCode, this.userData)
                    const userData = await this.localStorage.get('tempUserData');
                    globalStore.store.account = {...userData, ...this.account};                
                    this.showConfirmationMessage = false;
                    this.$emit('close-account');
                    this.tempData = undefined;
                    this.updateStorage()             
                    eventBus.$emit('account-loaded')
                } catch(error) {
                    console.log(error);
                    if(error.error && error.error == "Unauthorized") {
                        eventBus.$emit('toggle-toast', { text: "Unauthorized", danger: true })
                    } else if(error?.result?.message) {
                        eventBus.$emit('toggle-toast', { text: error.result?.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }
                } finally {
                    this.spinner = false;
                }
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

            async updateStorage(){
                const { date, ...userData } = this.userData;
                try {
                    await this.localStorage.set('userData', userData);
                } catch(error) {
                    console.log(error);
                }
                try {
                    await this.localStorage.remove('tempUserData');
                } catch(error) {
                    console.log(error);
                }
            },

            async checkTempData(){
                /* If confirmation code sent and not confirmed */
                if(this.account && this.account.email) return false;
                try {
                    const userData = await this.localStorage.get('tempUserData');
                    const hours = (Date.now() - userData.date) / (60 * 1000);
                    if(hours < 60) {
                        this.showConfirmationMessage = true;
                        this.userData = userData;
                        await this.localStorage.remove('tempUserData');
                    }
                } catch(error) {
                    //console.log(error);
                }
            },

            toggleView(){
                this.showAddKey = !this.showAddKey;
                this.showConfirmationMessage = false;
            }
        }
    }
</script>
