<template>
    
    <div>
        <div class="ui-br-ext-form-title">{{action}}</div >

        <form novalidate name="ui-br-ext-new-module" onsubmit="return false">
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-new-module-label">Module name</label>
                <input type="text" name="ui-br-ext-new-module-label" v-model="newModule.moduleName" maxlength="10" minlength="2"/>
                <span class="ui-br-ext-message">{{errorMessage.moduleName}}</span>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-new-module-label">Module description</label>
                <textarea type="text" name="ui-br-ext-new-module-label" v-model="newModule.moduleDescr"></textarea>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-checkbox" v-if="newModule.id && !newModule.allowDelete">
                <input type="checkbox" name="jira" id="ui-br-ext-save-to-jira" v-model="newModule.inactivate">
                <label for="ui-br-ext-save-to-jira">Inactivate</label>
            </div>
        </form>
        <div class="ui-br-ext-btn-group">
            <button class="ui-br-ext-btn" @click="activateModule" data-listener="off" v-if="newModule.id && false">
                <span class="ui-br-ext-spinner"></span>
                <span>Activate</span> 
            </button>
            <button class="ui-br-ext-btn" @click="deleteModule" data-listener="off" v-if="newModule.id && newModule.allowDelete">
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
    import moduleService from '../../../services/module.service'

    export default {
        name: 'EditModule',

        props: [
            'module',
            'account',
            'user'
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
                    moduleName: '',
                    moduleDescr: '', 
                    inactivate: false
                },
                errorMessage: {moduleName: ''},
                action: 'Create new module',
                moduleStatusEnum: {
                    active: 1,
                    inactive: 2
                }
            }
        },

        methods: {
            async saveModule(){

                this.errorMessage.moduleName = '';
                this.newModule.moduleName = this.newModule.moduleName.trim();
                this.newModule.moduleDescr = this.newModule.moduleDescr.trim();
                if(this.newModule.moduleName && this.newModule.moduleName != ''){

                    try {
                        let moduleId = undefined;

                        if (this.newModule.id) {
                            moduleId = await this.patch({...this.newModule, ...this.account});
                        } else {
                            moduleId = await this.post({...this.newModule, ...this.account});
                        }
                        
                        console.log(moduleId);
                        if(moduleId){ 
                            this.$emit('saveModule', this.newModule)
                        }                    
                    } catch(error) {
                        console.log(error.error);
                        this.errorMessage.moduleName = error.error
                    }                                      
                } else {
                    this.errorMessage.moduleName = 'Enter module key'
                }
            },

            resetModule() {
                this.newModule.moduleName = '';
                this.newModule.moduleDescr = '';
                this.newModule.saveToJira = undefined;
                this.action = 'Create new module';
                delete this.newModule.id;
                this.$emit('cancelEditing');
            },

            async deleteModule(module) {
                if (confirm('Are you suuure?')) {
                    try {
                        const result = await this.delete(this.module.id, this.account);
                        console.log(result.status == 'success');

                        if(result){ 
                            this.$emit('deleteModule')
                        } else {
                            alert('Sorry. Something went wrong. Please try later.')
                        }

                    } catch(error) {
                        console.log(error);
                        alert('Sorry. Something went wrong. Please try later.')
                    }
                }
            },

            activateModule(module) {
                console.log(module);
            },

            isEditing() {
                if(this.module && this.module.id) {
                    this.action = 'Edit module';
                    this.newModule = {...this.module};
                    this.newModule.inactivate = this.newModule.lkModuleStatusId == this.moduleStatusEnum.active ? false : true;
                }
            }
        }
    }
</script>