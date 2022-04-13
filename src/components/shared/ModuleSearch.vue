<template>

    <form class="ui-br-ext-report-form">
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-modules">Module</label>
            <input type="text" v-model="searchQuery" @input="onSearch">
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

    import moduleService from '../../services/module.service';

    export default {
        name: 'ModuleSearch',

        props: [
            'oldModule',
            'validation',
            'account',
            'projectId'
        ],

        mounted() {
            this.setFormValue();
            this.get = moduleService.getModules;
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
                if (this.timeout) clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    this.searchQuery = this.searchQuery.trim();
                    if(this.searchQuery.length >= 2) {
                        this.getmodules()
                    } else {
                        this.searchResults = []
                    }
                    this.module = {};
                }, 300);
            },

            async getmodules() {
                if (this.searchQuery.length != '') {
                    try {
                        this.searchResults = await this.get(this.account, this.searchQuery, this.projectId)
                    } catch(error) {
                        console.log(error);
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