<template>
    <div class="ui-br-ext-settings-body">
        <form autocomplete="off" novalidate name="ui-br-ext-new-project" v-on:submit.prevent>
            <div class="ui-br-ext-form-container ui-br-ext-checkbox">
                <input type="checkbox" name="jira" id="ui-br-ext-save-to-jira" v-model="globalSettings.saveToDb" @input="onDbSave">
                <label for="ui-br-ext-save-to-jira">Save to Database</label>
            </div>
        </form>
    </div>
    
</template>


<script>

    import { globalStore } from './../../../main';
    import storage from './../../../common/storage';

    export default {
        name: 'Account',
        
        created() { 
            this.localStorage = storage
        },

        mounted() {
            this.account = globalStore?.store?.account;
            this.globalSettings = globalStore.store.globalSettings;
        },

        data() {
            return {
                account: {},
                globalSettings: {
                    saveToDb: false
                }
            }
        },

        methods: {
            async onDbSave(){
                globalStore.store.globalSettings.saveToDb = this.globalSettings.saveToDb;
                await this.localStorage.set('globalSettings', this.globalSettings);
            },
        }
    }
</script>