<template>
    <div>
        <div>
            <div class="ui-br-ext-tabs-container">
                <div class="ui-br-ext-tabs">
                    <div class="ui-br-ext-tab" @click="ifFilter = !ifFilter; ifGlobal = false; setReports([]); reportNotFound=false" :class="{active: ifFilter}">Search filters</div>
                    <div class="ui-br-ext-tab" @click="ifGlobal = !ifGlobal; ifFilter = false; setReports([]); reportNotFound=false" :class="{active: ifGlobal}">Global search</div>
                </div>
                <div class="ui-br-ext-tab-item" v-if="ifFilter">
                    <ProjectSearch :account="account" :validation="true"  :oldProject="project" ref="projectForm"/>

                    <ModuleSearch :account="account" :validation="true" :project="project" :oldModule="module" ref="moduleForm"/>

                    <EnvironmentSearch :account="account" :validation="true" :oldEnvironment="environment" ref="environmentForm"/>

                    <div class="ui-br-ext-dates">
                        <div class="ui-br-ext-fromto ui-br-ext-form-container ui-br-ext-text">
                            <label for="ui-br-ext-from">From</label>
                            <input type="date" name="ui-br-ext-from" id="ui-br-ext-from" v-model="from">
                            <span class="ui-br-ext-message" v-if="count>0 && from==''" >Field is required</span>
                            <span class="ui-br-ext-message" v-if="count>0 && from!='' && to!='' && !dateValid" >From date cannot be</span>
                        </div>
                        <div class="ui-br-ext-fromto ui-br-ext-form-container ui-br-ext-text">
                            <label for="ui-br-ext-to">To</label>
                            <input type="date" name="ui-br-ext-to" id="ui-br-ext-to" v-model="to">
                            <span class="ui-br-ext-message" v-if="count>0 && to==''" >Field is required</span>
                        </div>
                    </div>
                    <div class="ui-br-ext-input-wrap">
                        <div class="ui-br-ext-input-wrap-label">Include</div>
                        <div class="ui-br-ext-form-container ui-br-ext-checkbox">
                            <input type="checkbox" name="pdf" id="ui-br-ext-save-to-pdf" v-model="includeCompleted">
                            <label for="ui-br-ext-save-to-pdf">Completed</label>
                        </div>
                        <div class="ui-br-ext-form-container ui-br-ext-checkbox">
                            <input type="checkbox" name="pdf" id="ui-br-ext-send-email" v-model="includeCanceled">
                            <label for="ui-br-ext-send-email">Canceled</label>
                        </div>
                    </div>
                    
                    <div v-if="reportNotFound" class="ui-br-ext-warning-text" >
                        No Bug report found
                    </div>
                    <div class="ui-br-ext-btn-group">
                        <button class="ui-br-ext-btn" @click="getReports" data-listener="off">
                            <span class="ui-br-ext-spinner"></span>
                            <span>Search</span> 
                        </button>
                    </div>
                </div>

                <div class="ui-br-ext-tab-item" v-if="ifGlobal">
                    <BugSearch :account="account" ref="bugSearchForm"/>
                    <div v-if="reportNotFound" class="ui-br-ext-warning-text" >
                        No Bug report found
                    </div>
                    <div class="ui-br-ext-btn-group">
                        <button class="ui-br-ext-btn" @click="globalSearch" data-listener="off">
                            <span class="ui-br-ext-spinner"></span>
                            <span>Search</span> 
                        </button>
                    </div>
                </div>
            </div>            
        </div>
        <div v-if="reports.length > 0">
            <div class="ui-br-ext-warning-text"  style="margin-bottom: 10px;">
                {{reports.length}} Bug report found
            </div>
            <div v-for="(report, index) in reports" :key="index">
                <div class="ui-br-ext-review-card">
                    <div class="ui-br-ext-review-box">
                        <span class="ui-br-ext-review-title">Bug id:</span>
                        <span class="ui-br-ext-review-text">{{report.bugIndex}}</span>
                    </div>
                    <div class="ui-br-ext-review-box">
                        <span class="ui-br-ext-review-title">Bug title:</span>
                        <span class="ui-br-ext-review-text">{{report.title}}</span>
                    </div>
                    <div class="ui-br-ext-review-box" v-if="report.created_at">
                        <span class="ui-br-ext-review-title">Created at:</span>
                        <span class="ui-br-ext-review-text">{{new Date(report.created_at).toLocaleString()}}</span>
                    </div>
                    <div class="ui-br-ext-review-box">
                        <span class="ui-br-ext-btn-lnk"  @click="showDetails(report.bugId)">Details</span>
                        <a class="ui-br-ext-btn-lnk" v-if="report.screenshotPath"  :href="report.screenshotPath" target="_blank">Screenshot</a>
                    </div>                   
                </div >
            </div>
        </div>                      
    </div>
</template>

<script>

    import EnvironmentSearch from '../../shared/EnvironmentSearch';
    import ModuleSearch from '../../shared/ModuleSearch';
    import ProjectSearch from '../../shared/ProjectSearch';
    import BugSearch from '../../shared/BugSearch';
    import reportService from '../../../services/report.service';
    import eventBus from '../../../eventBus';
    import clickBlocker from '../../../services/clickonbug.service';    
    import { globalStore } from './../../../main';

    export default {
        name: 'AllReports',

        props: [
            'sharedReports'
        ],

        components: {
            EnvironmentSearch,
            ModuleSearch,
            ProjectSearch,
            BugSearch,
        },

        created() { 
            this.get = reportService.getReports;
            this.getGlobal = reportService.getGlobalReports;
            this.addClickBlocker = clickBlocker.blockBugElement;
            this.removeClickBlocker = clickBlocker.unblockBugElements;
            this.environment = globalStore.store.reviewBug.environment;
            this.module = globalStore.store.reviewBug.module; 
            this.project = globalStore.store.reviewBug.project || globalStore.store.project;
            this.account = globalStore.store.account;
            this.from = globalStore.store.reviewBug.from;
            this.to = globalStore.store.reviewBug.to;   
            this.reports = this.sharedReports;         
        },

        mounted() {
            eventBus.$on('projectChanged', (project) => { 
                this.module = {};  
                globalStore.store.reviewBug.module = {};
                this.project = project;
            });
            this.showElements();
        },

        data() {
            return {
                reportsToDisplay: [],
                reports: [],
                count: 0,
                from: '',
                to: '',
                environment: {},
                module: {},
                dateValid: false,
                account: {},
                project: {},
                ifFilter: false,
                ifGlobal:false,
                searchQuery: '',
                reportNotFound: false,
                includeCompleted: false,
                includeCanceled: false,
            }
        },

        methods: {

            async getReports(){
                if(!this.validateForm()) return false;
                try {
                    const reports = await this.get(this.account, this.environment.environmentId, this.module.moduleId, this.from, this.to, this.includeCompleted, this.includeCanceled);
                    if(reports.length > 0) {
                        this.setReports(reports)
                        this.showElements();
                        this.ifFilter = false;
                        this.ifGlobal = false;
                        this.reportNotFound = false;
                    } else {
                        this.reportNotFound = true;
                    }
                    
                } catch(error) {
                    console.log(error);
                }                   
                
            },

            validateForm(){
                this.count = 0;
                this.reports = [];

                if(!this.$refs.environmentForm.formValidation()) this.count++;                  
                if(!this.$refs.moduleForm.formValidation()) this.count++;
                if(!this.$refs.projectForm.formValidation()) this.count++;
                if(!this.from) this.count++;              
                if(!this.to) this.count++;           
                if(!this.validateDate()) this.count++;
                
                if(this.count > 0) return false;

                this.environment = this.$refs.environmentForm.environment;
                this.module = this.$refs.moduleForm.module;
                this.project = this.$refs.projectForm.project;
                globalStore.store.reviewBug.environment = this.environment
                globalStore.store.reviewBug.module = this.module
                globalStore.store.reviewBug.project = this.project
                globalStore.store.reviewBug.from = this.from
                globalStore.store.reviewBug.to = this.to
                return true;
            },

            validateDate(){
                const from = new Date(this.from);
                const to = new Date(this.to);
                this.dateValid = (from.getTime() <= to.getTime());
                return this.dateValid;
            },

            showDetails(bugId) {
                this.$emit('show-details', bugId);
            },

            showElements(){
                this.reports.forEach((report) => {
                    report.element = this.selectElement(report.xpath, report.bugId);
                })
            },

            selectElement(xpath, bugId){
                let element = false;
                try {
                    element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
                } catch(e) {
                    console.log(e)
                }
                if(element){
                    this.createElement(element, bugId)
                }
                return element
            },

            createElement(element, bugId){
                element.classList.add('ui-br-ext-outlined-element', 'ui-br-ext-selected-element-outline-red', 'ui-br-ext-outlined-element-childs-no-events', `ui-br-ext-searched-element-id-${bugId}`); 
                this.addClickBlocker(element);
            },

            async globalSearch(){
                if (!this.$refs.bugSearchForm.formValidation()) return false;
                const searchQuery = this.$refs.bugSearchForm.searchQuery;
                const includeCompleted = this.$refs.bugSearchForm.includeCompleted;
                const includeCanceled = this.$refs.bugSearchForm.includeCanceled;
                try {
                    const reports = await this.getGlobal(this.account, searchQuery, includeCompleted, includeCanceled);
                    if(reports.length > 0) {
                        this.setReports(reports)
                        this.showElements();
                        this.ifFilter = false;
                        this.ifGlobal = false;
                        this.reportNotFound = false;
                    } else {
                        this.reportNotFound = true;
                    }
                    
                } catch(error) {
                    console.log(error);
                }
            },

            setReports(reports){
                const els = document.querySelectorAll('.ui-br-ext-outlined-element');
                this.removeClickBlocker(els);
                this.reports = reports;
                this.$emit('setReports', reports);
            }
        }
    }
</script>