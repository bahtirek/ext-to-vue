<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-settings" id="ui-br-ext-settings">
                <div class="ui-br-ext-drop-title">Settings</div>
                <div class="ui-br-ext-drop-body">
                    
                    <div class="ui-br-ext-settings-container">
                        <div class="ui-br-ext-setting-title" @click="ifProject = !ifProject; ifAccount = false">Project</div>
                        <Project v-if="ifProject" />
                    </div>
                    
                    <div class="ui-br-ext-settings-container">
                        <div class="ui-br-ext-setting-title" @click="ifAccount = !ifAccount; ifProject = false">Account</div>
                        <Account v-if="ifAccount" />
                    </div>
                    
                </div>
            </div>
</template>


<script>

    import Project from './settings/Project';
    import Account from './settings/Account';
    import { globalStore } from './../../main';

    export default {
        name: 'SettingsDrop',
        components: {
            Project,
            Account
        },

        data() {
            return {
                ifProject: false,
                ifAccount: false
            }
        },

        methods: {
            toggleSetting(el) {
                
            },
        }
    }
</script>