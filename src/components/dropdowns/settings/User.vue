<template>
    
    <div class="ui-br-ext-settings-body">

        <div class="ui-br-ext-btn-link ui-br-ext-btn-create-project">
            <span id="ui-br-ext-btn-link" @click="showAddUser = !showAddUser;" :class="{active: showAddUser}">Add user</span>  
        </div>

        <UserDetails :user="user" v-if="!showAddUser" />

        <div  v-if="showAddUser">
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="firstname">First name</label>
                <input type="text" name="firstname" v-model="userForm.firstname"/>
                <span class="ui-br-ext-message"></span>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="lastname">Last name</label>
                <input type="text" name="lastname" v-model="userForm.lastname"/>
                <span class="ui-br-ext-message"></span>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="email">Email</label>
                <input type="text" name="email" v-model="userForm.email"/>
                <span class="ui-br-ext-message"></span>
            </div>
            <button class="ui-br-ext-btn" id="ui-br-ext-save-new-module" data-listener="off">
                <span class="ui-br-ext-spinner" :class="{ active: spinner }"></span>
                <span @click="onUserSave">Save</span > 
            </button>
        </div >
    </div>
    
</template>


<script>

    import { globalStore } from './../../../main';
    import regKeyAuth from './../../../common/regkey';
    import storage from './../../../common/storage';
    import eventBus from './../../../eventBus';
    import UserDetails from '../../shared/UserDetails';


    export default {
        name: 'Account',

        components: {
            UserDetails
        },

        created() { 
            this.auth = regKeyAuth.auth,
            this.localStorage = storage
        },

        mounted() {
            this.account = globalStore.store.account;
            this.user = globalStore.store.user;
        },

        data() {
            return {
                userForm: {
                    firstname: '',
                    lastname: '',
                    email: ''
                },
                spinner: false,
                user: {},
                showAddUser: false
            }
        },

        methods: {
            async onUserSave(){
                console.log(this.userForm);
                const userString = JSON.stringify(this.userForm)
                await this.localStorage.set('user', userString)
                globalStore.store.user = this.userForm;
                this.user = this.userForm;
                eventBus.$emit('user-loaded');
                this.userForm = {
                    firstname: '',
                    lastname: '',
                    email: ''
                }
                this.showAddUser = false;
            },

        }
    }
</script>