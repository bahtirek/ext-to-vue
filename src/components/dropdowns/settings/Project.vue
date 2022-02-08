<template>
    
        <div class="ui-br-ext-settings-body">           
            
            <div class="ui-br-ext-btn-link ui-br-ext-btn-create-project" v-if="account.isAdmin == 1">
                <span id="ui-br-ext-btn-link" @click="showAddProject = !showAddProject; resetProject" :class="{active: showAddProject}">Create project</span>  
            </div>


            <div class="ui-br-ext-form-container ui-br-ext-textarea" v-if="!showAddProject">
                <label for="ui-br-ext-modules">Choose project</label>
                <input type="text" v-model="searchQuery" @input="onSearch">
                <span class="ui-br-ext-message" v-if="searchQuery!=='' && searchQuery.length > 2 && searchResults && searchResults.length == 0">No project found</span>
                <span class="ui-br-ext-search-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ad55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span >
                <div class="ui-br-ext-search-results" v-if="searchResults && searchResults.length > 0">
                    <ul>
                        <li v-for="project in searchResults.slice(0, 10)" :key="project.jiraId">
                            <span class="ui-br-ext-module-label" @click="onResultClick(project)">{{project.projectKey}}</span>
                            <div class="ui-br-ext-module-icons" v-if="account.isAdmin == 1">
                                <span @click="onProjectEdit({...project})">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                </span>
                                <span class="trash-icon" @click="onProjectDelete(project)">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </span>
                            </div>
                            
                        </li>
                    </ul>
                </div>
            </div>

            <ProjectDetails :project="project" v-if="!showAddProject" />

            <div  class="ui-br-ext-new-module-cont" v-if="showAddProject">
                <form novalidate name="ui-br-ext-new-project">
                    <div class="ui-br-ext-form-container ui-br-ext-textarea">
                        <label for="ui-br-ext-new-project-label">Project key</label>
                        <input type="text" name="ui-br-ext-new-project-label" v-model="newProject.projectKey" />
                        <span class="ui-br-ext-message">{{errorMessage.projectKey}}</span>
                    </div>
                    <div class="ui-br-ext-form-container ui-br-ext-textarea" v-show="newProject.saveToJira">
                        <label for="ui-br-ext-new-project-label">Jira id</label>
                        <input type="text" name="ui-br-ext-new-project-label" v-model="newProject.jiraId" />
                        <span class="ui-br-ext-message">{{errorMessage.jiraId}}</span>
                    </div>
                    <div class="ui-br-ext-form-container ui-br-ext-checkbox" v-if="account && account.registrationKey">
                    <input type="checkbox" name="jira" id="ui-br-ext-save-to-jira" v-model="newProject.saveToJira">
                        <label for="ui-br-ext-save-to-jira">Jira project</label>
                    </div>
                </form>
                <div class="ui-br-ext-btn-group">
                    <button class="ui-br-ext-btn" @click="saveProject" data-listener="off">
                        <span class="ui-br-ext-spinner"></span>
                        <span>Save</span> 
                    </button>
                    <button class="ui-br-ext-btn-danger" @click="showAddProject=false" data-listener="off">
                        <span class="ui-br-ext-spinner"></span>
                        <span>Cancel</span> 
                    </button>
                </div>
            </div>


        </div>
   
</template>


<script>
    import { globalStore } from './../../../main';
    import eventBus from './../../../eventBus';
    import ProjectDetails from '../../shared/ProjectDetails';
    import storage from './../../../common/storage';
    import projectService from '../../../services/project.service'

    export default {
        name: 'Project',

        components: {
            ProjectDetails
        },

        created() {
            this.localStorage = storage;
            this.post = projectService.postProject;
            this.get = projectService.getProjects;
        },

        mounted() { 
            this.account = globalStore.store.account;
            this.project = globalStore.store.project;
            this.user = globalStore.store.user;
        },

        data() {
            return {
                showAddProject: false,
                project: {},
                newProject: {
                    projectKey: '',
                    jiraId: '', 
                    saveToJira: 0,
                },
                searchQuery: '',
                errorMessage: {projectKey: '', jiraId: ''},
                account: {},
                projects: [],
                timeout: null,
                searchResults: []
            }
        },

        methods: {
            async saveProject(){

                this.errorMessage.projectKey = '';
                this.errorMessage.jiraId = '';
                
                if(this.newProject.projectKey != ''){

                    // Request jira id if Jira
                    if(this.newProject.jira && this.newProject.jiraId == '') {
                        this.errorMessage.jiraId = 'Enter project id ';
                        return false;
                    }
    
                    try {
                        const projectId = await this.post({...this.newProject, ...this.account});                       
                        this.onResultClick({...this.newProject, projectId: projectId});
                        this.showAddProject = false;
                    } catch(error) {
                        this.errorMessage.jiraId = error.error
                    }
                                       
                } else {
                    this.errorMessage.projectKey = 'Enter project key'
                }
            },

            async onResultClick(project) {
                this.searchQuery = '';
                this.project = project;
                globalStore.store.project = project;
                globalStore.store.currentModule = {};
                eventBus.$emit('account-loaded');
                this.searchResults = []
                await this.saveToLocal();
            },

            onSearch() {
                if (this.timeout) clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    this.getProjects()
                }, 300);
            },

            async getProjects() {
                if (this.searchQuery.length != '') {
                    try {
                        this.searchResults = await this.get(this.account, this.searchQuery);
                        console.log(this.searchResults);
                    } catch(error) {
                        console.log(error);
                    }                   
                } else {
                    this.searchResults = []
                }
            },

            async saveToLocal(){
                const projectString = JSON.stringify(this.project)
                try{
                    await this.localStorage.set('project', projectString)
                    alert(`project ${this.newProject.projectKey} successfully saved`);
                } catch(error) {
                    console.log(error);
                }
            },

            resetProject() {
                this.newProject.projectKey = '';
                this.newProject.jiraId = '';
            },


            onProjectEdit(project) {
                this.showAddProject = true;
                this.newProject = project
            },

            onProjectDelete(project) {
                console.log(project);
            }
        }
    }
</script>