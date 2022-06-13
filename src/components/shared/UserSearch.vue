<template>

    <div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-modules">User email</label>
            <input type="email" v-model="emailSearch">
            <span class="ui-br-ext-message ">{{emailError}}</span>
            <span class="ui-br-ext-search-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ad55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span >
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <div class="ui-br-ext-search-results" v-if="user && user.emailId">
                <ul>
                    <li class="ui-br-ext-hovered">
                        <span class="ui-br-ext-module-label ui-br-ext-no-hover">{{user.email}}</span>
                        <div class="ui-br-ext-module-icons">
                            <span @click="onUserEdit()">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <button class="ui-br-ext-btn" id="ui-br-ext-save-new-module" data-listener="off">
            <span class="ui-br-ext-spinner" :class="{ active: spinner }"></span>
            <span @click="onUserSearch">Search</span > 
        </button>
    </div>
    
</template>


<script>

    import userService from '../../services/user.service';
    import eventBus from '../../eventBus';

    export default {
        name: 'UserSearch',

        components: {
        },

        created() { 
            this.get = userService.getUser;
        },

        mounted() {
            
        },

        data() {
            return {
                spinner: false,
                user: {},
                showAddUser: false,
                emailError: '',
                emailSearch: '',
                email: {},
            }
        },

        methods: {

            emailValidation(){
                this.emailError = '';
                if (this.emailSearch.trim() == ''){ 
                    this.emailError = "Email is required";
                    return false;
                }
                if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.emailSearch))) {
                    this.emailError = 'Please enter a valid email address';
                    return false;
                }
                return true;
            },

            async onUserSearch(){
                if (!this.emailValidation()) return false;
                console.log(this.emailSearch);
                try {
                    this.user = await this.get(this.account, this.emailSearch)
                } catch (error) {
                    console.log(error);
                    if(error.result.message) {
                        eventBus.$emit('toggle-toast', { text: error.result.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }
                }
            },

            onUserEdit(){
                this.$emit('editUser', this.user)
            },

            resetUser(){
                this.user = {};
                this.emailSearch = '';
                this.showAddUser = false;
                this.emailError = '';
                this.emailSearch = '';
            },

        }
    }
</script>