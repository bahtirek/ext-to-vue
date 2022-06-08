<template>
    
        <div class="ui-br-ext-settings-body"> 
            <div v-if="project && project.projectKey">
                <div class="ui-br-ext-btn-link ui-br-ext-btn-create-project" v-if="account.isAdmin == 1">
                    <span id="ui-br-ext-btn-link" @click="showAddModule = !showAddModule; moduleToEdit=undefined" :class="{active: showAddModule}">Create module</span>  
                </div>
                

                <div class="ui-br-ext-form-container ui-br-ext-textarea" v-if="!showAddModule">
                    <label for="ui-br-ext-modules">Choose module</label>
                    <input type="text" v-model="searchQuery" @input="onSearch">
                    <span class="ui-br-ext-message" v-if="searchQuery!=='' && searchResults && searchResults.length == 0">No modules found</span>
                    <span class="ui-br-ext-search-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ad55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </span >
                    <div class="ui-br-ext-search-results" v-if="searchResults && searchResults.length > 0">
                        <ul>
                            <li v-for="module in searchResults.slice(0, 10)" :key="module.moduleId">
                                <span class="ui-br-ext-module-label" :class="{'ui-br-ext-disabled' : module.lkProjectStatusId}" >{{module.name}}</span>
                                <div class="ui-br-ext-module-icons" v-if="account.isAdmin == 1">
                                    <span @click="onModuleEdit({...module})">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                    </span>
                                </div>
                                
                            </li>
                        </ul>
                    </div>
                </div>

                <ProjectDetails :project="project" v-if="!showAddModule"  />

                <!-- <ModuleDetails :module="currentModule" v-if="!showAddModule" /> -->

                <EditModule v-if="showAddModule" @saveModule="saveModule" @cancelEditing="cancelEditing" @deleteModule="deleteModule" :project="project" :module="moduleToEdit" :account="account" :user="user" />
            </div>
            <div v-if="!project.id" class="ui-br-ext-warning-text" >
                Choose project first
            </div>
        </div>
   
</template>


<script>
    import { globalStore } from './../../../main';
    import eventBus from './../../../eventBus';
    /* import ModuleDetails from '../../shared/ModuleDetails'; */
    import ProjectDetails from '../../shared/ProjectDetails';
    import storage from './../../../common/storage';
    import EditModule from './EditModule';
    import moduleService from '../../../services/module.service'


    export default {
        name: 'Module',

        components: {
            ProjectDetails,
            EditModule
        },

        created() {
            this.localStorage = storage
        },

        mounted() { 
            this.account = globalStore.store.account;
            this.currentModule = globalStore.store.currentModule;
            this.user = globalStore.store.user;
            this.project = globalStore.store.project;
            this.get = moduleService.getModules;
            eventBus.$on('regkey-updated', () => {
                this.onResultClick({})
            })
        },

        data() {
            return {
                showAddModule: false,
                project: {},
                moduleToEdit: undefined,
                module: {
                    name: '',
                    description: ''
                },
                searchQuery: '',
                moduleMessage: '',
                currentModule: {},
                account: {},
                searchResults: [],
            }
        },

        methods: {
            
            onSearch() {
                if (this.timeout) clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    this.searchQuery = this.searchQuery.trim();
                    if(this.searchQuery.length >= 2) this.getModules()
                }, 300);
            },

            async getModules() {
                if (this.searchQuery.length != '') {
                    try {
                        this.searchResults = await this.get(this.account, this.searchQuery, this.project.id)
                    } catch(error) {
                        console.log(error);
                        if(error.result.message) {
                            eventBus.$emit('toggle-toast', { text: error.result.message, danger: true })
                        } else {
                            eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                        }
                    }                   
                } else {
                    this.searchResults = []
                }
            },

            async onResultClick(module) {
                this.searchQuery = '';
                this.searchResults = [];
                this.currentModule = module;
                globalStore.store.currentModule = module;
                await this.saveToLocal();
            },

            async saveToLocal(){
                const moduleString = JSON.stringify(this.currentModule)
                try{
                    await this.localStorage.set('module', moduleString)
                } catch(error) {
                    console.log(error);
                }
            },

            onModuleEdit(module) {
                this.searchQuery = '';
                this.searchResults = [];
                this.showAddModule = true;
                this.moduleToEdit = {...module};
            },

            saveModule(module){
                this.onResultClick(module);
                this.cancelEditing();
            },

            cancelEditing(){
                this.showAddModule = false;
                this.moduleToEdit = undefined;
            },

            deleteModule(){
                this.onResultClick(undefined);
                this.cancelEditing();
            }
        }
    }
</script>