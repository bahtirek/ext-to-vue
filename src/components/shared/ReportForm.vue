<template>

    <form class="ui-br-ext-report-form">
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-title">Title</label>
            <textarea name="ui-br-ext-title" v-model="form.title" rows="1" data-gramm="false" maxlength="100"></textarea>
            <span class="ui-br-ext-message" v-if="count>0 && form.title==''">Field is required</span>
        </div>
        
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-modules">Environment</label>
            <input type="text" v-model="searchQuery" @input="onSearch">
            <span class="ui-br-ext-message" v-if="count==0 && searchQuery!=='' && searchResults && searchResults.length == 0 && !form.environment.environmentId">No environments found</span>
            <span class="ui-br-ext-message" v-if="count>0 && !form.environment.environmentId">Field is required</span>
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
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-description">Description</label>
            <textarea name="ui-br-ext-description" v-model="form.description" rows="2" data-gramm="false" maxlength="1000"></textarea>
            <span class="ui-br-ext-message" v-if="count>0 && form.description==''">Field is required</span>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-act-results">Actual results</label>
            <textarea name="ui-br-ext-act-results" v-model="form.actualResults" rows="3" data-gramm="false" maxlength="1000"></textarea>
            <span class="ui-br-ext-message" v-if="count>0 && form.actualResults==''">Field is required</span>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-exp-results">Expected results</label>
            <textarea name="ui-br-ext-exp-results" v-model="form.expectedResults" rows="3" data-gramm="false" maxlength="1000"></textarea>
            <span class="ui-br-ext-message" v-if="count>0 && form.expectedResults==''">Field is required</span>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-rep-steps">Steps to reproduce</label>
            <textarea name="ui-br-ext-rep-steps" v-model="form.stepsToReproduce" rows="3" data-gramm="false" maxlength="1000"></textarea>
            <span class="ui-br-ext-message" v-if="count>0 && form.stepsToReproduce==''">Field is required</span>
        </div>
    </form >

</template>

<script>

    import environmentService from '../../services/environment.service';
    import { globalStore } from './../../main';

    export default {
        name: 'ReportForm',

        props: [
            'report'
        ],

        mounted() {
            this.setFormValue();
            this.get = environmentService.getEnvironments;
            this.account = globalStore?.store?.account;
            this.searchQuery = this.report?.environment?.name ?? '';
        },

        data() {
            return {
                form: {
                    description: '',
                    title: '',
                    actualResults: '',
                    expectedResults: '',
                    stepsToReproduce: '',
                    environment: {}
                },
                count: 0,
                searchQuery: '',
                searchResults: [],
                environment: {},
                account: {}
            }
        },

        methods: {

            setFormValue(){
                if(this.report) {
                    this.form.description= this.report.description || "",
                    this.form.title= this.report.title || "",
                    this.form.actualResults= this.report.actualResults || "",
                    this.form.expectedResults= this.report.expectedResults || "",
                    this.form.stepsToReproduce= this.report.stepsToReproduce || "",
                    this.form.environment= this.report.environment || {}
                }
            },

            resetReportData(){
                this.form = {
                    description: '',
                    title: '',
                    actualResults: '',
                    expectedResults: '',
                    stepsToReproduce: '',
                    environment: {}
                }
            },

            formValidation(){
                this.count = 0;
                this.searchResults = [];
                return new Promise((resolve, reject) => {  
                    Object.entries(this.form).forEach(([key, val]) => {
                        if(key != "environment") {
                            val = val.trim();
                            this.form[key] = val;
                            console.log(val);
                            if (val == '') {
                                this.count++
                            }
                        }
                    });
                    if(!this.form.environment.environmentId) this.count++;
                    if(this.count == 0) resolve(true)
                    resolve(false)

                })
            },

            onSearch() {
                if (this.timeout) clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    this.searchQuery = this.searchQuery.trim();
                    if(this.searchQuery.length >= 2) {
                        this.getEnvironments()
                    } else {
                        this.searchResults = []
                    }
                    this.form.environment = {};
                }, 300);
            },

            async getEnvironments() {
                if (this.searchQuery.length != '') {
                    try {
                        this.searchResults = await this.get(this.account, this.searchQuery)
                    } catch(error) {
                        console.log(error);
                    }                   
                }
            },

            async onResultClick(environment) {
                this.searchQuery = environment.name;
                this.searchResults = [];
                this.form.environment = environment;
            },

            onEnvironmentDelete(environment) {
                console.log(environment);
            }
        }
    }
</script>