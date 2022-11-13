

<template>
    
    <div class="ui-br-ext-settings-body">

        <div class="ui-br-ext-btn-link ui-br-ext-btn-create-project">
            <span id="ui-br-ext-btn-link" @click="showAddUser = !showAddUser;" :class="{active: showAddUser}">Add user</span>  
        </div>

        <div v-if="!showAddUser">
            <UserSearch @editUser="editUser" :account="account"/>
        </div>

        <div  v-if="showAddUser">
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="email">Email</label>
                <input type="text" name="email" v-model="email"/>
                <span class="ui-br-ext-message">{{emailError}}</span>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-checkbox">
                <input type="checkbox" name="IsAdmin" id="ui-br-ext-save-to-jira" v-model="IsAdmin">
                <label for="ui-br-ext-save-to-jira">Admin</label>
            </div>
            
            <div class="ui-br-ext-btn-group" v-if="user && user.UserProfileId">
                <button class="ui-br-ext-btn" @click="deleteUser" data-listener="off">
                    <span class="ui-br-ext-spinner"></span>
                    <span>Delete</span> 
                </button>
                <button class="ui-br-ext-btn" id="ui-br-ext-save-new-module" data-listener="off">
                    <span class="ui-br-ext-spinner" :class="{ active: spinner }"></span>
                    <span @click="onUserSave">Update</span > 
                </button>
                <button class="ui-br-ext-btn-danger" @click="resetUser()" data-listener="off">
                    <span class="ui-br-ext-spinner"></span>
                    <span>Cancel</span> 
                </button>
            </div>
            <div class="ui-br-ext-btn-group"  v-if="user && !user.UserProfileId">
                <button class="ui-br-ext-btn" id="ui-br-ext-save-new-module" data-listener="off">
                    <span class="ui-br-ext-spinner" :class="{ active: spinner }"></span>
                    <span @click="onUserSave">Save</span > 
                </button>
                <button class="ui-br-ext-btn-danger" @click="resetUser()" data-listener="off">
                    <span class="ui-br-ext-spinner"></span>
                    <span>Cancel</span> 
                </button>
            </div>
        </div >
    </div>
    
</template>


<script>

    import userService from '../../../services/user.service';
    import eventBus from './../../../eventBus';
    import UserSearch from '../../shared/UserSearch';
    import storage from '../../../common/storage';


    export default {
        name: 'User',

        components: {
            UserSearch
        },

        created() {
            this.post = userService.postUser;
            this.patch = userService.patchUser;
            this.delete = userService.deleteUser;
            this.localStorage = storage;
        },
        
        mounted() {
            this.getAdminData()
        },

        data() {
            return {
                email: '',
                spinner: false,
                showAddUser: false,
                emailError: '',
                user: {},
                IsAdmin: false,
                account: {}
            }
        },

        methods: {

            emailValidation(){
                this.emailError = '';
                if (this.email.trim() == ''){ 
                    this.emailError = "Email is required";
                    return false;
                }
                if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email))) {
                    this.emailError = 'Please enter a valid email address';
                    return false;
                }
                return true;
            },

            editUser(user){
                console.log(user);
                this.user = user;
                this.showAddUser = true;
                this.email = user.email;
                this.IsAdmin = user.IsAdmin;
            },

            async onUserSave(){
                if (!this.emailValidation()) return false;
                this.showAddUser = true;
                try {
                    if (this.user && this.user.UserProfileId) {
                        await this.patch({account: this.account, email: this.email, UserProfileId: this.user.UserProfileId});
                    } else {
                        this.IsAdmin = this.IsAdmin ? 1 : 0;
                        const data = {
                            RegistrationKey: this.account.registrationKey, 
                            UserEmail: this.account.userEmail, 
                            UserAppId: this.account.userAppId, 
                            NewUserEmail: this.email, 
                            IsAdmin: this.IsAdmin
                        }
                        await this.post(data);
                    }
                    this.resetUser();
                } catch(error) {
                    console.log(error);
                    if(error.error) {
                        this.emailError = error.error
                    } else if(error.result.message){
                        eventBus.$emit('toggle-toast', { text: error.result.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }
                    this.showAddUser = false;
                }
            },


            async deleteUser(){
                try {
                    await this.delete(this.account, this.user.UserProfileId);
                    this.resetUser();
                } catch(error) {
                    console.log(error);
                    if(error.result.message) {
                        eventBus.$emit('toggle-toast', { text: error.result.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }
                }
            },

            resetUser(){
                this.user = {};
                this.email = '';
                this.showAddUser = false;
                this.emailError = '';
                this.IsAdmin = '';
            },

            async getAdminData(){
                console.log('getuser');
                try {
                    this.account = await this.localStorage.get('userData')
                } catch (error) {
                    console.log(error);
                }
            },

        }
    }
</script>