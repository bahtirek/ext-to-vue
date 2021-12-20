<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-settings" id="ui-br-ext-settings">
                <div class="ui-br-ext-drop-title">Settings</div>
                <div class="ui-br-ext-drop-body">
                    
                    <div class="ui-br-ext-settings-container">
                        <div class="ui-br-ext-setting-title" @click="toggleSetting">Project</div>
                        <Project/>
                    </div>
                    
                    <div class="ui-br-ext-settings-container">
                        <div class="ui-br-ext-setting-title" @click="toggleSetting">Account</div>
                        <Account  />
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
        
        created() { 
            
        },

        data() {
            return {
                
            }
        },

        methods: {
            toggleSetting(e) {
                console.log(e);
            },
        }
    }
</script>