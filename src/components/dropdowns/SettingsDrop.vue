<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-settings" id="ui-br-ext-settings">
                <div class="ui-br-ext-drop-title">Settings</div>
                <div class="ui-br-ext-drop-body">
                    
                    <div class="ui-br-ext-settings-container" v-if="account && account.registratonKey">
                        <div class="ui-br-ext-setting-title" @click="ifProject = !ifProject; ifAccount = false; ifUser = false">Project</div>
                        <Project v-if="ifProject" />
                    </div>
                    
                    <div class="ui-br-ext-settings-container">
                        <div class="ui-br-ext-setting-title" @click="ifAccount = !ifAccount; ifProject = false; ifUser = false">Account</div>
                        <Account v-if="ifAccount" />
                    </div>
                    
                    <div class="ui-br-ext-settings-container">
                        <div class="ui-br-ext-setting-title" @click="ifUser = !ifUser; ifProject = false; ifAccount = false">User</div>
                        <User v-if="ifUser" />
                    </div>
                    
                </div>
            </div>
</template>


<script>

    import Project from './settings/Project';
    import Account from './settings/Account';
    import User from './settings/User';
    import { globalStore } from './../../main';
    import eventBus from './../../eventBus'

    export default {
        name: 'SettingsDrop',
        components: {
            Project,
            Account,
            User
        },

        mounted: function () {
            this.account = globalStore?.store?.account;
            this.currentProject = globalStore?.store.currentProject;

            eventBus.$on('account-loaded', (val) => {
                this.account = globalStore.store.account;
                this.currentProject = globalStore.store.currentProject;
            })
        },

        data() {
            return {
                ifProject: false,
                ifAccount: false,
                ifUser: false,
                currentProject: {},
                account: {},
            }
        },

        methods: {
            
        }
    }
</script>