<template>

    <form class="ui-br-ext-report-form">
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-modules">Project</label>
            <input type="text" v-model="searchQuery" @input="onSearch">
            <span class="ui-br-ext-message" v-if="validation && searchQuery!=='' && searchResults && searchResults.length == 0 && !project.id">No projects found</span>
            <span class="ui-br-ext-message" v-if="validation && count>0 && searchQuery==''" >Field is required</span>
            <span class="ui-br-ext-search-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ad55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span >
            <div class="ui-br-ext-search-results" v-if="searchResults && searchResults.length > 0">
                <ul>
                    <li v-for="project in searchResults.slice(0, 10)" :key="project.id">
                        <span class="ui-br-ext-module-label" @click="onResultClick(project)">{{project.projectKey}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </form >

</template>

<script>
import eventBus from '../../eventBus';

    import projectService from '../../services/project.service';

    export default {
        name: 'ProjectSearch',

        props: [
            'oldProject',
            'validation',
            'account'
        ],

        mounted() {
            this.setFormValue();
            this.get = projectService.getProjects;
        },

        data() {
            return {
                count: 0,
                searchQuery: '',
                searchResults: [],
                project: {
                    projectKey: '',
                    id: undefined
                }
            }
        },

        methods: {

            setFormValue(){
                if(this.oldProject) {
                    this.searchQuery = this.oldProject?.projectKey ?? '';
                    this.project = this.oldProject;
                }
            },

            resetReportData(){
                this.project = {}
            },

            formValidation(){
                if(this.project.id) return true

                this.count++
                return false
            },

            onSearch() {
                if(!(this.account && this.account.token)) return false;
                if (this.timeout) clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    this.searchQuery = this.searchQuery.trim();
                    if(this.searchQuery.length >= 2) {
                        this.getprojects()
                    } else {
                        this.searchResults = []
                    }
                    this.project = {};
                }, 300);
            },

            async getprojects() {
                if (this.searchQuery.length != '' && this.searchQuery.length <= 10) {
                    try {
                        this.searchResults = await this.get(this.account, this.searchQuery)
                    } catch(error) {
                        console.log(error);
                    }                   
                }
            },

            async onResultClick(project) {
                this.searchQuery = project.projectKey;
                this.searchResults = [];
                this.project = project;
                this.count = 0;
                eventBus.$emit('projectChanged', this.project);// resets modules
            }
        }
    }
</script>