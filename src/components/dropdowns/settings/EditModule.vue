<template>
    
    <div>
        <div class="ui-br-ext-form-title">{{action}}</div >

        <form autocomplete="off" novalidate name="ui-br-ext-new-module" onsubmit="return false">
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-new-module-label">Module name</label>
                <input type="text"  autocomplete="off"  name="ui-br-ext-new-module-label" v-model="newModule.name" maxlength="50" minlength="2"/>
                <span class="ui-br-ext-message">{{errorMessage.name}}</span>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-new-module-label">Module description</label>
                <textarea type="text" name="ui-br-ext-new-module-label" v-model="newModule.description" maxlength="255" ></textarea>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-checkbox" v-if="newModule.moduleId && !newModule.allowDelete">
                <input type="checkbox" name="jira" id="ui-br-ext-save-to-jira" v-model="newModule.inactivate" />
                <label for="ui-br-ext-save-to-jira">Inactivate</label>
            </div>
        </form>
        <div class="ui-br-ext-btn-group">
            <button class="ui-br-ext-btn" @click="deleteModule" data-listener="off" v-if="newModule.moduleId && newModule.allowDelete">
                <span class="ui-br-ext-spinner"></span>
                <span>Delete</span> 
            </button>
            <button class="ui-br-ext-btn" @click="saveModule" data-listener="off">
                <span class="ui-br-ext-spinner"></span>
                <span>Save</span> 
            </button>
            <button class="ui-br-ext-btn-danger" @click="resetModule()" data-listener="off">
                <span class="ui-br-ext-spinner"></span>
                <span>Cancel</span> 
            </button>
        </div>
    </div>
        
</template>


<script>
    import moduleService from '../../../services/module.service';
    import eventBus from '../../../eventBus';

    export default {
        name: 'EditModule',

        props: [
            'module',
            'account',
            'user',
            'project'
        ],

        mounted() {
            this.isEditing()
        },

        created() {
            this.post = moduleService.postModule;
            this.patch = moduleService.patchModule;
            this.delete = moduleService.deleteModule;
        },

        data() {
            return {
                newModule: {
                    name: '',
                    description: '', 
                    inactivate: false
                },
                errorMessage: {name: ''},
                action: 'Create new module',
                moduleStatusEnum: {
                    active: 1,
                    inactive: 2
                }
            }
        },

        methods: {
            async saveModule(){

                this.errorMessage.name = '';
                this.newModule.name = this.newModule.name.trim();
                this.newModule.description = this.newModule.description.trim();
                if(this.newModule.name && this.newModule.name != ''){

                    try {
                        let module = undefined;

                        if (this.newModule.moduleId) {
                            module = await this.patch({...this.newModule, ...this.account, projectId: this.project.id});
                        } else {
                            module = await this.post({...this.newModule, ...this.account, projectId: this.project.id});
                        }
                        
                        if(module){ 
                            this.$emit('saveModule', module.result)
                        }                    
                    } catch(error) {
                        console.log(error);
                        if(error.error) {
                            this.errorMessage.name = error.error
                        } else if(error.result?.message){
                            eventBus.$emit('toggle-toast', { text: error.result?.message, danger: true })
                        } else {
                            eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                        }
                    }                                      
                } else {
                    this.errorMessage.name = 'Enter module key'
                }
            },

            resetModule() {
                this.newModule.name = '';
                this.newModule.description = '';
                this.newModule.saveToJira = undefined;
                this.action = 'Create new module';
                delete this.newModule.moduleId;
                this.$emit('cancelEditing');
            },

            async deleteModule(module) {
                if (confirm('Are you suuure?')) {
                    try {
                        await this.delete(this.module.moduleId, this.account, this.project.id);
                        this.$emit('deleteModule')
                    } catch(error) {
                        console.log(error);
                        if(error.result?.message) {
                            eventBus.$emit('toggle-toast', { text: error.result?.message, danger: true })
                        } else {
                            eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                        }
                    }
                }
            },

            isEditing() {
                if(this.module && this.module.moduleId) {
                    this.action = 'Edit module';
                    this.newModule = {...this.module};
                }
            }
        }
    }
</script>