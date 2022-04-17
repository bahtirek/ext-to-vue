<template>
    <div>
        <div>
            <div class="ui-br-ext-tabs-container">
                <div class="ui-br-ext-tabs">
                    <div class="ui-br-ext-tab" @click="ifFilter = !ifFilter; ifGlobal = false; setReports([])" :class="{active: ifFilter}">Search filters</div>
                    <div class="ui-br-ext-tab" @click="ifGlobal = !ifGlobal; ifFilter = false; setReports([])" :class="{active: ifGlobal}">Global search</div>
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
                    <div v-if="reports.length == 0" class="ui-br-ext-warning-text" >
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
                    <BugSearch :account="account" ref="environmentForm"/>
                    <div class="ui-br-ext-btn-group">
                        <button class="ui-br-ext-btn" @click="globalSearch" data-listener="off">
                            <span class="ui-br-ext-spinner"></span>
                            <span>Search</span> 
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- <div class="ui-br-ext-settings-container">
                <div class="ui-br-ext-setting-title" @click="ifFilter = !ifFilter; ifGlobal = false; setReports([])">Search by filter</div>
                 <div v-if="ifFilter" class="ui-br-ext-accordion-body"> 

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
                    <div v-if="reports.length == 0" class="ui-br-ext-warning-text" >
                        No Bug report found
                    </div>
                    <div class="ui-br-ext-btn-group">
                        <button class="ui-br-ext-btn" @click="getReports" data-listener="off">
                            <span class="ui-br-ext-spinner"></span>
                            <span>Search</span> 
                        </button>
                    </div>
                 </div>
            </div>

            <div class="ui-br-ext-settings-container">
                <div class="ui-br-ext-setting-title" @click="ifGlobal = !ifGlobal; ifFilter = false; setReports([])">Global search</div>
                <div v-if="ifGlobal" class="ui-br-ext-accordion-body"> 
                    <BugSearch :account="account" ref="environmentForm"/>
                    <div class="ui-br-ext-btn-group">
                        <button class="ui-br-ext-btn" @click="globalSearch" data-listener="off">
                            <span class="ui-br-ext-spinner"></span>
                            <span>Search</span> 
                        </button>
                    </div>
                </div>
            </div> -->
            
        </div>
        <div v-if="reports.length > 0" style="margin-top: 10px;">
            <div class="ui-br-ext-warning-text" >
                {{reports.length}} Bug report found
            </div>
            <div v-for="(report, index) in reportsToDisplay" :key="index">
                <div class="ui-br-ext-review-card" v-if="!report.element" >
                    <div class="ui-br-ext-review-box">
                        <span class="ui-br-ext-review-title">Bug id:</span>
                        <span class="ui-br-ext-review-text">{{report.bugIndex}}</span>
                    </div>
                    <div class="ui-br-ext-review-box">
                        <span class="ui-br-ext-review-title">Bug title:</span>
                        <span class="ui-br-ext-review-text">{{report.title}}</span>
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

    import UserDetails from '../../shared/UserDetails';
    import ModuleDetails from '../../shared/ModuleDetails';
    import EnvironmentSearch from '../../shared/EnvironmentSearch';
    import ModuleSearch from '../../shared/ModuleSearch';
    import ProjectSearch from '../../shared/ProjectSearch';
    import BugSearch from '../../shared/BugSearch';
    import reportService from '../../../services/report.service';
    import eventBus from '../../../eventBus';
    import clickBlocker from '../../../common/click-blocker';    
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
            this.addClickBlocker = clickBlocker.addClickBlocker;         
            this.removeSingleClickBlocker = clickBlocker.removeSingleClickBlocker;               
            this.removeClickBlocker = clickBlocker.removeClickBlocker;  
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
                searchQuery: ''
            }
        },

        methods: {

            async getReports(){
                if(!this.validateForm()) return false;
                console.log(this.environment, this.module, this.from, this.to);
                try {
                    const reports = await this.get(this.account, this.environment.environmentId, this.module.moduleId, this.from, this.to);
                    if(reports.length > 0) {
                        this.setReports(reports)
                        this.showElements();
                        this.ifFilter = false;
                        this.ifGlobal = false;
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

            showImage(screenshot) {
                if(screenshot) {
                    let image = new Image();
                    image.src = screenshot;

                    let w = window.open("");
                    w.document.write(image.outerHTML);
                }
            },

            showDetails(bugId) {
                this.$emit('show-details', bugId);
            },

            showElements(){
                console.log(this.reports);
                for (let index = 0; index < this.reports.length; index++) {
                    this.selectElement(index); 
                    if(index == this.reports.length - 1) {
                        console.log(index);
                        const els = document.querySelectorAll('.ui-br-ext-outlined-element');
                        this.addClickBlocker(els);
                        this.reportsToDisplay = this.reports.filter(report => !report.element);
                    }                  
                }
            },

            selectElement(index){
                let report = this.reports[index];
                let element = document.evaluate(report.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
                if(element){
                    report.element = element;
                    element.classList.add('ui-br-ext-outlined-element');
                    element.style.cssText = element.style.cssText + "outline: red dashed 3px !important;";
                    element.setAttribute('data-ext-index', index);                 
                    //element.addEventListener('mousedown', this.showDetailsOnClick, true);                   
                } else {
                    report.element = false;
                    // move report to the bottom of reports array
                    this.reports.splice(index, 1);
                    this.reports.push(report);
                    eventBus.$on('report-loaded');
                }
            },

            globalSearch(){
                console.log(this.searchQuery);
            },

            setReports(reports){
                this.reports = reports;
                this.$emit('setReports', reports);
            }
        }
    }
</script>