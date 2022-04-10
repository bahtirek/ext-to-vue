<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-settings" id="ui-br-ext-settings">
                <div class="ui-br-ext-drop-title">Settings</div>
                <div class="ui-br-ext-drop-body">
                    
                    <div class="ui-br-ext-settings-container" v-if="account.isAdmin == 1">
                        <div class="ui-br-ext-setting-title" @click="ifModule = !ifModule; ifGlobal = false; ifProject = false; ifAccount = false; ifUser = false; ifEnvironment = false">Module</div>
                        <Module v-if="ifModule" />
                    </div>

                    <div class="ui-br-ext-settings-container" v-if="account && account.registrationKey">
                        <div class="ui-br-ext-setting-title" @click="ifProject = !ifProject; ifGlobal = false; ifModule = false; ifAccount = false; ifUser = false; ifEnvironment = false">Project</div>
                        <Project v-if="ifProject" />
                    </div>

                    <div class="ui-br-ext-settings-container" v-if="account && account.registrationKey">
                        <div class="ui-br-ext-setting-title" @click="ifEnvironment = !ifEnvironment; ifGlobal = false; ifProject = false; ifModule = false; ifAccount = false; ifUser = false">Environment</div>
                        <Environment v-if="ifEnvironment" />
                    </div>
                    
                    <div class="ui-br-ext-settings-container">
                        <div class="ui-br-ext-setting-title" @click="ifAccount = !ifAccount; ifGlobal = false; ifProject = false; ifModule = false; ifUser = false; ifEnvironment = false">Account</div>
                        <Account v-if="ifAccount" />
                    </div>

                    <div class="ui-br-ext-settings-container" v-if="account && account.registrationKey">
                        <div class="ui-br-ext-setting-title" @click="ifGlobal = !ifGlobal; ifProject = false; ifModule = false; ifAccount = false; ifUser = false">Global</div>
                        <Global v-if="ifGlobal" />
                    </div>

                    <div class="ui-br-ext-settings-container">
                        <div class="ui-br-ext-setting-title" @click="ifUser = !ifUser; ifGlobal = false; ifProject = false; ifModule = false; ifAccount = false; ifEnvironment = false">User</div>
                        <User v-if="ifUser" />
                    </div>
                    
                </div>
            </div>
</template>


<script>

    import Module from './settings/Module';
    import Account from './settings/Account';
    import Project from './settings/Project';
    import Global from './settings/Global';
    import Environment from './settings/Environment';
    import User from './settings/User';
    import { globalStore } from './../../main';
    import eventBus from './../../eventBus'

    export default {
        name: 'SettingsDrop',
        components: {
            Module,
            Account,
            User,
            Project,
            Environment,
            Global
        },

        mounted: function () {
            this.account = globalStore?.store?.account;
            this.currentModule = globalStore?.store.currentModule;

            eventBus.$on('account-loaded', (val) => {
                this.account = globalStore.store.account;
                this.currentModule = globalStore.store.currentModule;
            })
            eventBus.$on('regkey-updated', (val) => {
                this.account = globalStore.store.account;
                this.currentModule = globalStore.store.currentModule;
            })
        },

        data() {
            return {
                ifModule: false,
                ifAccount: false,
                ifUser: false,
                ifProject: false, 
                ifEnvironment: false, 
                ifGlobal: false, 
                currentModule: {},
                account: {},
            }
        },

        methods: {
            
        }
    }
</script>