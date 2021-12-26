<template>
    
        <div class="ui-br-ext-settings-body">           
            <div class="ui-br-ext-current-project" v-if="currentProject.label">
                Current project: <span>{{currentProject.label}}</span>
                <div>{{currentProject.description}}</div>
            </div  >
            
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-projects">Projects</label>
                <input type="text" v-model="searchQuery">
                <span class="ui-br-ext-message" v-if="searchQuery!=='' && searchResults.length == 0">No projects found</span>
                <span class="ui-br-ext-search-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ad55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span >
                <div class="ui-br-ext-search-results" v-if="searchResults.length > 0">
                    <ul>
                        <li v-for="project in searchResults.slice(0, 3)" :key="project.id" @click="onResultClick(project)">{{project.label}}</li>
                    </ul>
                </div>
            </div>
            <div class="ui-br-ext-btn-link" v-if="account.isAdmin == 1">
                <span id="ui-br-ext-btn-link" @click="showAddProject = !showAddProject" :class="{active: showAddProject}">Add new project</span>  
            </div>
            <div  class="ui-br-ext-new-project-cont" v-if="showAddProject">
                <form novalidate name="ui-br-ext-new-project">
                    <div class="ui-br-ext-form-container ui-br-ext-textarea">
                        <label for="ui-br-ext-new-project-label">Project label</label>
                        <input type="text" name="ui-br-ext-new-project-label" v-model="project.label" />
                        <span class="ui-br-ext-message">{{projectMessage}}</span>
                    </div>
                    <div class="ui-br-ext-form-container ui-br-ext-textarea">
                        <label for="ui-br-ext-new-project-name">Project description</label>
                        <textarea name="ui-br-ext-new-project-name" rows="2" v-model="project.description"></textarea>
                        <span class="ui-br-ext-message"></span>
                    </div>
                </form>
                
                <button class="ui-br-ext-btn" @click="saveProject" data-listener="off">
                    <span class="ui-br-ext-spinner"></span>
                    <span>Save</span> 
                </button>
            </div>
        </div>
   
</template>


<script>
    import { globalStore } from './../../../main';
    import eventBus from './../../../eventBus'

    export default {
        name: 'Project',

        mounted() { 
            this.account = globalStore.store.account;
            this.currentProject = globalStore.store.currentProject;
            console.log(this.account);

            eventBus.$on('account-loaded', () => {
                this.account = globalStore.store.account;
                this.currentProject = globalStore.store.currentProject;
            })
        },

        data() {
            return {
                showAddProject: false,
                project: {
                    label: '',
                    description: ''
                },
                searchQuery: '',
                projectMessage: '',
                currentProject: {},
                account: {}
            }
        },

        computed: {
            searchResults: function () {
                if(this.searchQuery == '') return [];
                return this.account.projects?.filter(project => project.label?.includes(this.searchQuery));
            }
        },

        methods: {
            saveProject(){
                this.projectMessage = '';
                const index = this.account.projects.findIndex(project => {
                    return project.label == this.project.label
                });
                if(index == -1) {
                    //post
                    this.account.projects.push({label: this.project.label, description: this.project.description});
                    alert(`Project ${this.project.label} successfully saved`);
                    this.project.label = '';
                    this.project.description = '';
                } else {
                    this.projectMessage = 'Project exist'
                }
            },

            onResultClick(project) {
                this.searchQuery = '';
                this.currentProject = project;
                globalStore.store.currentProject = project;
                eventBus.$emit('account-loaded')
            }
        }
    }
</script>