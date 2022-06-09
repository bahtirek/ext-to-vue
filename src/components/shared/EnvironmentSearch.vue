<template>

    <form class="ui-br-ext-report-form">
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-modules">Environment</label>
            <input type="text" v-model="searchQuery" @input="onSearch" autocomplete="off">
            <span class="ui-br-ext-message" v-if="validation && searchQuery!=='' && searchResults && searchResults.length == 0 && !environment.environmentId">No environments found</span>
            <span class="ui-br-ext-message" v-if="validation && count>0 && searchQuery==''" >Field is required</span>
            <span class="ui-br-ext-search-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ad55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span >
            <div class="ui-br-ext-search-results" v-if="searchResults && searchResults.length > 0">
                <ul>
                    <li v-for="environment in searchResults.slice(0, 10)" :key="environment.environmentId">
                        <span class="ui-br-ext-module-label" @click="onResultClick(environment)">{{environment.name}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </form >

</template>

<script>

    import environmentService from '../../services/environment.service';
    import eventBus from '../../eventBus';

    export default {
        name: 'EnvironmentSearch',

        props: [
            'oldEnvironment',
            'validation',
            'account'
        ],

        mounted() {
            this.setFormValue();
            this.get = environmentService.getEnvironments;
        },
        watch: {
            oldEnvironment: {
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
                environment: {
                    name: '',
                    environmentId: undefined
                }
            }
        },

        methods: {

            setFormValue(){
                if(this.oldEnvironment) {
                    this.searchQuery = this.oldEnvironment?.name ?? '';
                    this.environment = this.oldEnvironment;
                }
            },

            resetReportData(){
                this.environment = {}
            },

            formValidation(){
                if(this.environment.environmentId) return true

                this.count++
                return false
            },

            onSearch() {
                if(!(this.account && this.account.token)) return false;
                if (this.timeout) clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    this.searchQuery = this.searchQuery.trim();
                    if(this.searchQuery.length >= 2) {
                        this.getEnvironments()
                    } else {
                        this.searchResults = []
                    }
                    this.environment = {};
                }, 300);
            },

            async getEnvironments() {
                if (this.searchQuery.length != '') {
                    try {
                        this.searchResults = await this.get(this.account, this.searchQuery)
                    } catch(error) {
                        console.log(error);
                        if(error.result.message) {
                            eventBus.$emit('toggle-toast', { text: error.result.message, danger: true })
                        } else {
                            eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                        }
                    }                   
                }
            },

            async onResultClick(environment) {
                this.searchQuery = environment.name;
                this.searchResults = [];
                this.environment = environment;
                this.count = 0;
                this.$emit('setEnvironment', this.environment);
            }
        }
    }
</script>