<template>

    <form class="ui-br-ext-report-form">
        <ProjectSearch :account="account" :validation="validation"  :oldProject="project" ref="projectForm"/>

        <ModuleSearch :account="account" :project="project" :validation="validation" :oldModule="module" ref="moduleForm"/>

        <EnvironmentSearch :account="account" :validation="validation" :oldEnvironment="environment" ref="environmentForm"/>

        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-title">Title</label>
            <textarea name="ui-br-ext-title" v-model="form.title" rows="1" data-gramm="false" maxlength="100"></textarea>
            <span class="ui-br-ext-message" v-if="count>0 && form.title==''">Field is required</span>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-description">Description</label>
            <textarea name="ui-br-ext-description" v-model="form.description" rows="2" data-gramm="false" maxlength="1000"></textarea>
            <span class="ui-br-ext-message" v-if="count>0 && form.description==''">Field is required</span>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-act-results">Actual results</label>
            <textarea name="ui-br-ext-act-results" v-model="form.actualResult" rows="3" data-gramm="false" maxlength="1000"></textarea>
            <span class="ui-br-ext-message" v-if="count>0 && form.actualResult==''">Field is required</span>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-exp-results">Expected results</label>
            <textarea name="ui-br-ext-exp-results" v-model="form.expectedResult" rows="3" data-gramm="false" maxlength="1000"></textarea>
            <span class="ui-br-ext-message" v-if="count>0 && form.expectedResult==''">Field is required</span>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-rep-steps">Steps to reproduce</label>
            <textarea name="ui-br-ext-rep-steps" v-model="form.stepsToReproduce" rows="3" data-gramm="false" maxlength="1000"></textarea>
            <span class="ui-br-ext-message" v-if="count>0 && form.stepsToReproduce==''">Field is required</span>
        </div>
    </form >

</template>

<script>

    import EnvironmentSearch from '../shared/EnvironmentSearch';
    import ModuleSearch from '../shared/ModuleSearch';
    import ProjectSearch from '../shared/ProjectSearch';
    import { globalStore } from './../../main';

    export default {
        name: 'ReportForm',

        props: [
            'report',
            'validation'
        ],

        components: {
            EnvironmentSearch,
            ModuleSearch,
            ProjectSearch
        },

        created() {
            this.account = globalStore?.store?.account; 
            this.environment = globalStore.store.reportBug.environment;
            this.module = globalStore.store.reportBug.module;
            this.project = globalStore.store.reportBug.project;
        },

        mounted() {
            this.setFormValue();
            //this.searchQuery = this.report?.environment?.name ?? '';
        },

        data() {
            return {
                form: {
                    description: '',
                    title: '',
                    actualResult: '',
                    expectedResult: '',
                    stepsToReproduce: '',
                    environment: {},
                    module: {},
                    project: {}
                },
                count: 0,
                searchQuery: '',
                searchResults: [],
                account: {},
                project: {},
                environment: {},
                module: {}
            }
        },

        methods: {

            setFormValue(){
                if(this.report) {
                    this.form.description = this.report.description || "",
                    this.form.title = this.report.title || "",
                    this.form.actualResult = this.report.actualResult || "",
                    this.form.expectedResult = this.report.expectedResult || "",
                    this.form.stepsToReproduce = this.report.stepsToReproduce || "",
                    this.environment = this.report.environment || {},
                    this.module = this.report.module || {},
                    this.project = this.report.project || {}
                }
            },

            resetReportData(){
                this.form = {
                    description: '',
                    title: '',
                    actualResult: '',
                    expectedResult: '',
                    stepsToReproduce: ''
                }
            },

            formValidation(){
                this.count = 0;
                this.searchResults = [];
                return new Promise((resolve, reject) => {  
                    Object.entries(this.form).forEach(([key, val]) => {
                        if(typeof val === 'string' || val instanceof String) {
                            val = val.trim();
                            this.form[key] = val;
                            if (val == '') {
                                this.count++
                            }
                        }
                    });

                    if(!this.$refs.environmentForm.formValidation()) this.count++;                  
                    if(!this.$refs.moduleForm.formValidation()) this.count++;                  
                    if(!this.$refs.projectForm.formValidation()) this.count++;                  
                    
                    if(this.count == 0) resolve(true)
                    resolve(false)
                })
            },

            getReportForm(){
                if (this.validation){
                    this.form.environment = this.$refs.environmentForm.environment;
                    this.form.module = this.$refs.moduleForm.module;
                    this.form.project = this.$refs.projectForm.project;
                } else {
                    this.form.environment['name'] = this.$refs.environmentForm.searchQuery;
                    this.form.module['name'] = this.$refs.moduleForm.searchQuery;
                    this.form.project['projectKey'] = this.$refs.projectForm.searchQuery;
                }
                return this.form;
            },

        }
    }
</script>