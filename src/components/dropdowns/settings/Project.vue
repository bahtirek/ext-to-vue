<template>
    
        <div class="ui-br-ext-settings-body">           
            
            <div class="ui-br-ext-btn-link ui-br-ext-btn-create-project" v-if="account.isAdmin == 1">
                <span id="ui-br-ext-btn-link" @click="showAddProject = !showAddProject; resetProject()" :class="{active: showAddProject}">Create project</span>  
            </div>


            <div class="ui-br-ext-form-container ui-br-ext-textarea" v-if="!showAddProject">
                <label for="ui-br-ext-modules">Choose project</label>
                <input type="text" v-model="searchQuery">
                <span class="ui-br-ext-message" v-if="searchQuery!=='' && searchResults && searchResults.length == 0">No project found</span>
                <span class="ui-br-ext-search-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ad55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span >
                <div class="ui-br-ext-search-results" v-if="searchResults && searchResults.length > 0">
                    <ul>
                        <li v-for="project in searchResults.slice(0, 10)" :key="project.id">
                            <span class="ui-br-ext-module-label" @click="onResultClick(project)">{{project.key}}</span>
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
                        <input type="text" name="ui-br-ext-new-project-label" v-model="newProject.key" />
                        <span class="ui-br-ext-message">{{projectMessage}}</span>
                    </div>
                    <div class="ui-br-ext-form-container ui-br-ext-textarea">
                        <label for="ui-br-ext-new-project-label">Project id</label>
                        <input type="text" name="ui-br-ext-new-project-label" v-model="newProject.id" />
                    </div>
                </form>
                <div class="ui-br-ext-btn-group">
                    <button class="ui-br-ext-btn" @click="saveProject" data-listener="off">
                        <span class="ui-br-ext-spinner"></span>
                        <span>Save</span> 
                    </button>
                    <button class="ui-br-ext-btn-danger" @click="cancel" data-listener="off">
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

    export default {
        name: 'Project',

        components: {
            ProjectDetails
        },

        mounted() { 
            this.account = globalStore.store.account;
            this.project = globalStore.store.project;
            this.projects = globalStore.store.projects;
            this.user = globalStore.store.user;

            eventBus.$on('account-loaded', () => {
                this.account = globalStore.store.account;
                this.project = globalStore.store.project;
                this.projects = globalStore.store.projects;
            })
            
            eventBus.$on('user-loaded', () => {
                this.user = globalStore.store.user;
            })
        },

        data() {
            return {
                showAddProject: false,
                project: {},
                newProject: {
                    key: '',
                    id: ''
                },
                searchQuery: '',
                projectMessage: '',
                account: {},
                projects: []
            }
        },

        computed: {
            searchResults: function () {
                if(this.searchQuery == '') return [];
                return this.projects.filter(project => project.key?.includes(this.searchQuery));
            }
        },

        methods: {
            saveProject(){
                this.projectMessage = '';
                    console.log(this.projects);
                    console.log(this.newProject);
                const index = this.projects.findIndex(project => {
                    return project.key == this.newProject.key
                });

                if(index == -1) {
                    
                    //post
                    this.projects.push({key: this.newProject.key, id: this.newProject.id});
                    alert(`project ${this.newProject.key} successfully saved`);
                    this.showAddProject = false;
                    this.resetProject();
                    console.log(this.projects);         
                } else {
                    this.projectMessage = 'project exist'
                }
            },

            resetProject() {
                this.newProject.key = '';
                this.newProject.id = '';
            },

            onResultClick(project) {
                this.searchQuery = '';
                this.project = project;
                globalStore.store.project = project;
                eventBus.$emit('account-loaded')
            },

            onProjectEdit(project) {
                console.log(project);
                this.showAddProject = true;
                this.newProject = project
            },

            cancel() {
                this.project = { key: '', id: '' };
                this.showAddProject = false;
            },

            onProjectDelete(project) {
console.log(project);
            }
        }
    }
</script>