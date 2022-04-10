<template>
    
        <div class="ui-br-ext-settings-body"> 
            <div>
                <div class="ui-br-ext-btn-link ui-br-ext-btn-create-project" v-if="account.isAdmin == 1">
                    <span id="ui-br-ext-btn-link" @click="showAddEnvironment = !showAddEnvironment; environmentToEdit=undefined" :class="{active: showAddEnvironment}">Create environment</span>  
                </div>
                

                <div class="ui-br-ext-form-container ui-br-ext-textarea" v-if="!showAddEnvironment">
                    <label for="ui-br-ext-modules">Choose environment</label>
                    <input type="text" v-model="searchQuery" @input="onSearch">
                    <span class="ui-br-ext-message" v-if="searchQuery!=='' && searchResults && searchResults.length == 0">No environment found</span>
                    <span class="ui-br-ext-search-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ad55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </span >
                    <div class="ui-br-ext-search-results" v-if="searchResults && searchResults.length > 0">
                        <ul>
                            <li v-for="environment in searchResults.slice(0, 10)" :key="environment.environmentId">
                                <span class="ui-br-ext-module-label">{{environment.name}}</span>
                                <div class="ui-br-ext-module-icons" v-if="account.isAdmin == 1">
                                    <span @click="onEnvironmentEdit({...environment})">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                    </span>
                                </div>
                                
                            </li>
                        </ul>
                    </div>
                </div>

                <EditEnvironment v-if="showAddEnvironment" @saveEnvironment="saveEnvironment" @cancelEditing="cancelEditing" @deleteEnvironment="deleteEnvironment" :environment="environmentToEdit" :account="account" />
            </div>
        </div>
   
</template>


<script>
    import { globalStore } from './../../../main';
    import eventBus from './../../../eventBus';
    import storage from './../../../common/storage';
    import EditEnvironment from './EditEnvironment';
    import environmentService from '../../../services/environment.service'


    export default {
        name: 'Environment',

        components: {
            EditEnvironment
        },

        created() {
            this.localStorage = storage
        },

        mounted() { 
            this.account = globalStore.store.account;
            this.get = environmentService.getEnvironments;
        },

        data() {
            return {
                showAddEnvironment: false,
                environmentToEdit: undefined,
                environment: {
                    name: '',
                    description: ''
                },
                searchQuery: '',
                environmentMessage: '',
                account: {},
                searchResults: [],
            }
        },

        methods: {
            
            onSearch() {
                if (this.timeout) clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    this.searchQuery = this.searchQuery.trim();
                    if(this.searchQuery.length > 2) this.getEnvironments();
                }, 300);
            },

            async getEnvironments() {
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

            async onResultClick(environment) {
                this.searchQuery = '';
                this.searchResults = [];
                this.currentEnvironment = environment;
            },


            onEnvironmentEdit(environment) {
                this.searchQuery = '';
                this.searchResults = [];
                this.showAddEnvironment = true;
                this.environmentToEdit = {...environment};
            },

            saveEnvironment(environment){
                this.onResultClick(environment);
                this.cancelEditing();
            },

            cancelEditing(){
                this.showAddEnvironment = false;
                this.environmentToEdit = undefined;
            },

            deleteEnvironment(){
                this.onResultClick(undefined);
                this.cancelEditing();
            }
        }
    }
</script>