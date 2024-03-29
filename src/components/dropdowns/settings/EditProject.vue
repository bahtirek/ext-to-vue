<template>
    
    <div>
        <div class="ui-br-ext-form-title">{{action}}</div >

        <form autocomplete="off" novalidate name="ui-br-ext-new-project" v-on:submit.prevent>
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-new-project-label">Project key</label>
                <input type="text"  autocomplete="off"  name="ui-br-ext-new-project-label" v-model="newProject.projectKey" maxlength="10" minlength="2" :disabled="newProject.id && newProject.lkProjectStatusId == 2" />
                <span class="ui-br-ext-message">{{errorMessage.projectKey}}</span>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-new-project-label">Project description</label>
                <textarea type="text" name="ui-br-ext-new-project-label" v-model="newProject.description" maxlength="255" ></textarea>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-textarea" v-if="newProject.saveToJira">
                <label for="ui-br-ext-new-project-label">Jira id</label>
                <input type="text"  autocomplete="off"  name="ui-br-ext-new-project-label" v-model="newProject.jiraId" maxlength="10" minlength="2" />
                <span class="ui-br-ext-message">{{errorMessage.jiraId}}</span>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-checkbox" v-if="account && account.jiraSettings">
                <input type="checkbox" name="jira" id="ui-br-ext-save-to-jira" v-model="newProject.saveToJira">
                <label for="ui-br-ext-save-to-jira">Jira project</label>
            </div>
        </form>
        <div class="ui-br-ext-btn-group">
            <button class="ui-br-ext-btn" @click="projectStatus(1)" data-listener="off" v-if="newProject.id && newProject.lkProjectStatusId == 2">
                <span class="ui-br-ext-spinner"></span>
                <span>Activate</span> 
            </button>
            <button class="ui-br-ext-btn" @click="projectStatus(2)" data-listener="off" v-if="newProject.id && !newProject.allowDelete && newProject.lkProjectStatusId == 1">
                <span class="ui-br-ext-spinner"></span>
                <span>Inactivate</span> 
            </button>
            <button class="ui-br-ext-btn" @click="deleteProject" data-listener="off" v-if="newProject.id && newProject.allowDelete">
                <span class="ui-br-ext-spinner"></span>
                <span>Delete</span> 
            </button>
            <button class="ui-br-ext-btn" @click="saveProject" data-listener="off" >
                <span class="ui-br-ext-spinner"></span>
                <span>Save</span> 
            </button>
            <button class="ui-br-ext-btn-danger" @click="resetProject()" data-listener="off">
                <span class="ui-br-ext-spinner"></span>
                <span>Cancel</span> 
            </button>
        </div>
    </div>
        
</template>


<script>
    import projectService from '../../../services/project.service';
    import eventBus from '../../../eventBus';

    export default {
        name: 'EditProject',

        props: [
            'project',
            'account',
            'user'
        ],

        mounted() {
            this.isEditing()
        },

        created() {
            this.post = projectService.postProject;
            this.patch = projectService.patchProject;
            this.statusPatch = projectService.statusPatchProject;
            this.delete = projectService.deleteProject;
        },

        data() {
            return {
                newProject: {
                    projectKey: '',
                    description: '', 
                    jiraId: '', 
                    saveToJira: false,
                    inactivate: false
                },
                errorMessage: {projectKey: '', jiraId: ''},
                action: 'Create new project',
                projectStatusEnum: {
                    active: 1,
                    inactive: 2
                }
            }
        },

        methods: {
            async saveProject(){

                this.errorMessage.projectKey = '';
                this.errorMessage.jiraId = '';
                this.newProject.projectKey = this.newProject.projectKey.trim();
                this.newProject.description = this.newProject.description.trim();
                if(this.newProject.projectKey != ''){

                    // Request jira id if Jira

                    if(this.newProject.saveToJira && this.newProject.jiraId) {
                        this.newProject.jiraId = this.newProject.jiraId.toString().trim()
                    }
                    if(this.newProject.saveToJira && this.newProject.jiraId == '') {
                        this.errorMessage.jiraId = 'Enter jira id ';
                        return false;
                    }

                    try {
                        let project = undefined;

                        if (this.newProject.id) {
                            if(this.newProject.inactivate) this.newProject.lkProjectStatusId = 2;
                            project = await this.patch({...this.newProject, ...this.account});
                        } else {
                            project = await this.post({...this.newProject, ...this.account});
                        }
                        
                        if(project.result){
                            if(project.result.lkProjectStatusId == 2) project = {} 
                            this.$emit('saveProject', project.result)
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
                    this.errorMessage.projectKey = 'Enter project key'
                }
            },

            resetProject() {
                this.newProject.projectKey = '';
                this.newProject.description = '';
                this.newProject.jiraId = '';
                this.newProject.saveToJira = undefined;
                this.action = 'Create new project';
                delete this.newProject.id;
                this.$emit('cancelEditing');
            },

            async deleteProject(project) {
                if (confirm('Are you suuure?')) {
                    try {
                        await this.delete(this.project.id, this.account);

                        this.$emit('deleteProject')
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

            async projectStatus(value) {
                try {
                    this.newProject.lkProjectStatusId = value;
                    const project = await this.statusPatch({...this.newProject, ...this.account});
                    if(project.result){ 
                        this.$emit('saveProject', project.result)
                    }                    
                } catch(error) {
                    console.log(error);
                    if(error.result?.message) {
                        eventBus.$emit('toggle-toast', { text: error.result?.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }
                } 
            },

            isEditing() {
                if(this.project && this.project.id) {
                    this.action = 'Edit project';
                    this.newProject = {...this.project};
                    this.newProject.inactivate = this.newProject.lkProjectStatusId == this.projectStatusEnum.active ? false : true;
                }
            }
        }
    }

</script>