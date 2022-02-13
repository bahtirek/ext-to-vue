<template>
    
        <div class="ui-br-ext-settings-body">           
            
            <div class="ui-br-ext-btn-link ui-br-ext-btn-create-project" v-if="account.isAdmin == 1">
                <span id="ui-br-ext-btn-link" @click="showAddProject = !showAddProject; projectToEdit = undefined;" :class="{active: showAddProject}">Create project</span>  
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
                            <span class="ui-br-ext-module-label" @click="onResultClick(project)" :class="{'ui-br-ext-disabled' : project.lkProjectStatusId}" >{{project.projectKey}}</span>
                            <div class="ui-br-ext-module-icons" v-if="account.isAdmin == 1">
                                <span @click="onProjectEdit(project)">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                </span>
                            </div>
                            
                        </li>
                    </ul>
                </div>
            </div>

            <ProjectDetails :project="project" v-if="!showAddProject" />
            <EditProject v-if="showAddProject" @saveProject="saveProject" @cancelEditing="cancelEditing" :project="projectToEdit" :account="account" :user="user" />

        </div>
   
</template>


<script>
    import { globalStore } from './../../../main';
    import eventBus from './../../../eventBus';
    import ProjectDetails from '../../shared/ProjectDetails';
    import storage from './../../../common/storage';
    import EditProject from './EditProject';

    export default {
        name: 'Project',

        components: {
            ProjectDetails,
            EditProject
        },

        created() {
            this.localStorage = storage;
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
                searchQuery: '',
                timeout: null,
                searchResults: [],
                projectToEdit: undefined
            }
        },

        methods: {

            async onResultClick(project) {
                this.searchQuery = '';
                this.searchResults = [];
                this.project = project;
                globalStore.store.project = project;
                globalStore.store.currentModule = {};
                eventBus.$emit('account-loaded');
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
                        this.searchResults = await this.get(this.account, this.searchQuery)
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

            onProjectEdit(project) {
                this.searchQuery = '';
                this.searchResults = [];
                this.showAddProject = true;
                this.projectToEdit = {...project};
            },

            saveProject(project){
                this.onResultClick(project);
                this.cancelEditing();
            },

            cancelEditing(){
                this.showAddProject = false;
                this.projectToEdit = undefined;
            },
        }
    }
</script>