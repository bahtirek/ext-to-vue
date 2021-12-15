<template>
    
        <div class="ui-br-ext-setting-body">
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="regKey">Registration Key</label>
                <input type="text" name="regKey" v-model="regKey"/>
                <span class="ui-br-ext-message">Invalid Registration Key</span>
            </div>
            <button class="ui-br-ext-btn" id="ui-br-ext-save-new-project" data-listener="off">
                <span class="ui-br-ext-spinner"></span>
                <span @click="onSave">Save</span > 
            </button>
        </div>
    
</template>


<script>

    import { globalStore } from './../../../main';

    export default {
        name: 'Account',
        
        created() { 
            
        },

        data() {
            return {
                regKey: ''
            }
        },

        methods: {
            onSave(){
                console.log(this.regKey);
            }
        }
    }
</script>