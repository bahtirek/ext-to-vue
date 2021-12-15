<template>
    
        <div class="ui-br-ext-setting-body">
            <div class="ui-br-ext-btn-link">
                <span id="ui-br-ext-btn-link">Add project</span>  
            </div>
            <div  id="ui-br-ext-new-project-cont">
                <form novalidate name="ui-br-ext-new-project">
                    <div class="ui-br-ext-form-container ui-br-ext-textarea">
                        <label for="ui-br-ext-new-project-label">Project label</label>
                        <input type="text" name="ui-br-ext-new-project-label" id="ui-br-ext-new-project-label"/>
                        <span class="ui-br-ext-message"></span>
                    </div>
                    <div class="ui-br-ext-form-container ui-br-ext-textarea">
                        <label for="ui-br-ext-new-project-name">Project name</label>
                        <input type="text" name="ui-br-ext-new-project-name" id="ui-br-ext-new-project-name"/>
                        <span class="ui-br-ext-message"></span>
                    </div>
                </form>
                
                <button class="ui-br-ext-btn" id="ui-br-ext-save-new-project" data-listener="off">
                    <span class="ui-br-ext-spinner"></span>
                    <span>Save</span> 
                </button>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-projects">Projects</label>
                <select name="ui-br-ext-projects" id="ui-br-ext-projects">
                    <option value="" disabled>Choose project</option>
                </select>
            </div>
        </div>
   
</template>


<script>

    import { globalStore } from './../../../main';

    export default {
        name: 'Project',
        
        created() { 
            
        },

        data() {
            return {
                
            }
        },

        methods: {
            toggleDrop(e) {
                
            },
        }
    }
</script>