<template>

    <form autocomplete="off" class="ui-br-ext-report-form" v-on:submit.prevent>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-modules">Module</label>
            <input type="text"  autocomplete="off"  v-model="searchQuery" @input="onSearch">
            <span class="ui-br-ext-message" v-if="validation && searchQuery!=='' && searchResults && searchResults.length == 0 && !module.moduleId">No modules found</span>
            <span class="ui-br-ext-message" v-if="validation && count>0 && searchQuery==''" >Field is required</span>
            <span class="ui-br-ext-search-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ad55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span >
            <div class="ui-br-ext-search-results" v-if="searchResults && searchResults.length > 0">
                <ul>
                    <li v-for="module in searchResults.slice(0, 10)" :key="module.moduleId">
                        <span class="ui-br-ext-module-label" @click="onResultClick(module)">{{module.name}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </form >

</template>

<script>
import eventBus from '../../eventBus';

    import moduleService from '../../services/module.service';

    export default {
        name: 'ModuleSearch',

        props: [
            'oldModule',
            'validation',
            'account',
            'project'
        ],

        mounted() {
            this.setFormValue();
            this.get = moduleService.getModules;
            eventBus.$on('projectChanged', (project) => {
                this.module = {};
                this.searchQuery = '';
                this.project.id = project.id;
            });
        },

        watch: {
            oldModule: {
                handler: function(newVal, oldVal){
                    this.setFormValue()
                }
            }
        },

        data() {
            return {
                count: 0,
                searchQuery: '',
                searchResults: [],
                module: {
                    name: '',
                    moduleId: undefined
                }
            }
        },

        methods: {

            setFormValue(){
                if(this.oldModule) {
                    this.searchQuery = this.oldModule?.name ?? '';
                    this.module = this.oldModule;
                }
            },

            resetReportData(){
                this.module = {}
            },

            formValidation(){
                if(this.module.moduleId) return true

                this.count++
                return false
            },

            onSearch() {
                if(!(this.account && this.account.token)) return false;
                if (this.timeout) clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    let searchQuery = this.searchQuery;
                    searchQuery = searchQuery.trim();
                    if(searchQuery.length >= 2) {
                        this.getmodules(searchQuery)
                    } else {
                        this.searchResults = []
                    }
                    this.module = {};
                }, 300);
            },

            async getmodules(searchQuery) {
                if (searchQuery.length != '') {
                    try {
                        if(this.project.id) this.searchResults = await this.get(this.account, searchQuery, this.project.id)
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

            async onResultClick(module) {
                this.searchQuery = module.name;
                this.searchResults = [];
                this.module = module;
                this.count = 0;
                this.$emit('setmodule', this.module);
            }
        }
    }
</script>