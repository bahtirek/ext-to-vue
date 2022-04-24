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
            this.removeBugCoverEls();
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
                reportNotFound: false
            }
        },

        methods: {

            async getReports(){
                if(!this.validateForm()) return false;
                try {
                    const reports = await this.get(this.account, this.environment.environmentId, this.module.moduleId, this.from, this.to);
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
                const els = document.querySelectorAll('.ui-br-ext-outlined-element');
                this.addClickBlocker(els);
                this.reportsToDisplay = this.reports.filter(report => !report.element);
            },

            removeBugCoverEls(){
                const els = document.querySelectorAll('.ui-br-ext-bug-cover')
                    
                els.forEach(el => {
                    el.remove()
                });
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
                    element.classList.add('ui-br-ext-outlined-element');
                    element.style.cssText = element.style.cssText + "outline: red dashed 3px !important;";                                 
                }
                return element
            },

            createElement(element, bugId){
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const rect = this.getBoundingClientRect(element, scrollTop, scrollLeft);
                const newDiv = document.createElement("div");
                newDiv.addEventListener('click', (e) => {this.showDetailsOnClick(e.target)});
                newDiv.setAttribute('data-ext-bugid', bugId);
                newDiv.setAttribute('class', 'ui-br-ext-bug-cover');
                Object.entries(rect).forEach(([key, val]) => {
                    newDiv.style[key] = `${val}px`; 
                });
                document.body.appendChild(newDiv);
            },

            showDetailsOnClick(el) {
                const bugId = el.getAttribute('data-ext-bugid');
                if(!(bugId && bugId >= 0)) return false;

                eventBus.$emit('show-details', bugId)
            },

            getBoundingClientRect(element, scrollTop, scrollLeft){     
                let {top, right, bottom, left, width, height, x, y} = element.getBoundingClientRect();
                top = top + scrollTop;
                left = left + scrollLeft;   
                return {top, left} 
            },

            globalSearch(){
                if (!this.$refs.bugSearchForm.formValidation()) return false;
                const globalQuery = this.$refs.bugSearchForm.searchQuery;
            },

            setReports(reports){
                const els = document.querySelectorAll('.ui-br-ext-outlined-element');
                this.removeClickBlocker(els);
                this.removeBugCoverEls();
                this.reports = reports;
                this.$emit('setReports', reports);
            }
        }
    }
</script>