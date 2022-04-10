<template>

    <form class="ui-br-ext-report-form">
        <EnvironmentSearch :account="account" :validation="'on'" ref="environmentForm"/>

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
    import EnvironmentSearch from '../shared/EnvironmentSearch';
    import { globalStore } from './../../main';

    export default {
        name: 'ReportForm',

        props: [
            'report'
        ],

        components: {
            EnvironmentSearch
        },

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

                    if(!this.$refs.environmentForm.formValidation()) this.count++;                  
                    
                    if(this.count == 0) resolve(true)
                    resolve(false)
                })
            },

            getReportForm(){
                this.form.environment = this.$refs.environmentForm.environment;
                return this.form;
            },

            getEnvironment(){
                this.form.environment = this.$refs.environmentForm.environment;
            }

        }
    }
</script>