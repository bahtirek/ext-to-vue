<template>
    
        <div class="ui-br-ext-setting-body">
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="regKey">Registration Key</label>
                <input type="text" name="regKey" v-model="regKey"/>
                <span class="ui-br-ext-message">{{regError}}</span>
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
                regKey: '',
                regError: ''
            }
        },

        methods: {
           async onSave(){
                console.log(this.regKey);
                try {
                    let response = await fetch(`https://extension-auth.evendor.app/api/get_config?RegistrationKey=${this.regKey}`)
                    if (response.status === 200) {
                        let data = await response.json();
                        
                    } else if (response.status === 401) {
                        let data = await response.json()
                        this.regError = 'Invalid registration key'
                    } else {
                        this.regError = 'Sorry, something went wrong'
                    }
                } catch {
                    this.regError = 'Sorry, something went wrong'
                }
                    
            
            }
        }
    }
</script>