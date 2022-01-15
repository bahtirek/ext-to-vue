<template>
    
        <div class="ui-br-ext-settings-body">           
            <div class="ui-br-ext-current-module" v-if="currentModule.label">
                <span><strong>Current module: </strong></span><span>{{currentModule.label}}</span>
                <div>{{currentModule.description}}</div>
            </div  >
            
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-modules">Modules</label>
                <input type="text" v-model="searchQuery">
                <span class="ui-br-ext-message" v-if="searchQuery!=='' && searchResults && searchResults.length == 0">No modules found</span>
                <span class="ui-br-ext-search-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ad55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span >
                <div class="ui-br-ext-search-results" v-if="searchResults && searchResults.length > 0">
                    <ul>
                        <li v-for="module in searchResults.slice(0, 10)" :key="module.id">
                            <span class="ui-br-ext-module-label" @click="onResultClick(module)">{{module.label}}</span>
                            <div class="ui-br-ext-module-icons" v-if="account.isAdmin == 1">
                                <span @click="onModuleEdit({...module})">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                </span>
                                <span class="trash-icon" @click="onModuleDelete(module)">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </span>
                            </div>
                            
                        </li>
                    </ul>
                </div>
            </div>
            <div class="ui-br-ext-btn-link" v-if="account.isAdmin == 1">
                <span id="ui-br-ext-btn-link" @click="showAddModule = !showAddModule; resetModule()" :class="{active: showAddModule}">Add new module</span>  
            </div>
            <div  class="ui-br-ext-new-module-cont" v-if="showAddModule">
                <form novalidate name="ui-br-ext-new-module">
                    <div class="ui-br-ext-form-container ui-br-ext-textarea">
                        <label for="ui-br-ext-new-module-label">Module label</label>
                        <input type="text" name="ui-br-ext-new-module-label" v-model="module.label" />
                        <span class="ui-br-ext-message">{{moduleMessage}}</span>
                    </div>
                    <div class="ui-br-ext-form-container ui-br-ext-textarea">
                        <label for="ui-br-ext-new-module-name">Module description</label>
                        <textarea name="ui-br-ext-new-module-name" rows="2" v-model="module.description"></textarea>
                        <span class="ui-br-ext-message"></span>
                    </div>
                </form>
                
                <button class="ui-br-ext-btn" @click="saveModule" data-listener="off">
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
        name: 'Module',

        mounted() { 
            this.account = globalStore.store.account;
            this.currentModule = globalStore.store.currentModule;
            this.modules = globalStore.store.modules;
            this.user = globalStore.store.user;

            eventBus.$on('account-loaded', () => {
                this.account = globalStore.store.account;
                this.currentModule = globalStore.store.currentModule;
                this.modules = globalStore.store.modules;
            })
            
            eventBus.$on('user-loaded', () => {
                this.user = globalStore.store.user;
            })
        },

        data() {
            return {
                showAddModule: false,
                module: {
                    label: '',
                    description: ''
                },
                searchQuery: '',
                moduleMessage: '',
                currentModule: {},
                account: {},
                modules: []
            }
        },

        computed: {
            searchResults: function () {
                if(this.searchQuery == '') return [];
                return this.modules.filter(module => module.label?.includes(this.searchQuery));
            }
        },

        methods: {
            saveModule(){
                this.moduleMessage = '';
                const index = this.modules.findIndex(module => {
                    return module.label == this.module.label
                });
                if(index == -1) {
                    if(this.module.id) {
                        console.log('edit module');
                        alert(`Module ${this.module.label} successfully saved`);
                        this.showAddModule = false;
                        this.resetModule();
                        // patch
                    } else {
                        console.log('new module');
                        //post
                        this.modules.push({label: this.module.label, description: this.module.description});
                        alert(`Module ${this.module.label} successfully saved`);
                        this.showAddModule = false;
                        this.resetModule();
                    }
                    
                } else {
                    this.moduleMessage = 'Module exist'
                }
            },

            resetModule() {
                this.module.label = '';
                this.module.description = '';
                if(this.module.id) delete this.module.id;
            },

            onResultClick(module) {
                this.searchQuery = '';
                this.currentModule = module;
                globalStore.store.currentModule = module;
                eventBus.$emit('account-loaded')
            },

            onModuleEdit(module) {
                console.log(module);
                this.showAddModule = true;
                this.module = module
            },

            onModuleDelete(module) {
console.log(module);
            }
        }
    }
</script>