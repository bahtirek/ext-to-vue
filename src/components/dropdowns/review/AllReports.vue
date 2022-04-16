<template>
    <div>
        <div>
            <EnvironmentSearch :account="account" :validation="true" :oldEnvironment="environment" ref="environmentForm"/>

            <ProjectSearch :account="account" :validation="true"  :oldProject="project" ref="projectForm"/>

            <ModuleSearch :account="account" :validation="true" :project="project" :oldModule="module" ref="moduleForm"/>

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
            <div class="ui-br-ext-btn-group">
                <button class="ui-br-ext-btn" @click="getReports" data-listener="off">
                    <span class="ui-br-ext-spinner"></span>
                    <span>Submit</span> 
                </button>
            </div>
        </div>
        <div class="ui-br-ext-review-card" v-for="(report, index) in reportsToDisplay" :key="index">
            
            <UserDetails :user="report.user" />

            <div class="ui-br-ext-review-box ui-br-ext-ellipsis" v-if="report.description" @click="showDetails(index)">
                <div class="ui-br-ext-review-title">Description:</div>
                <div class="ui-br-ext-review-text">{{report.description}}</div>
            </div>
            <span class="ui-br-ext-btn-lnk" v-if="report.screenshot" @click="showImage(report.screenshot)">Screenshot</span>
        </div>
    </div>
</template>

<script>

    import UserDetails from '../../shared/UserDetails';
    import ModuleDetails from '../../shared/ModuleDetails';
    import EnvironmentSearch from '../../shared/EnvironmentSearch';
    import ModuleSearch from '../../shared/ModuleSearch';
    import ProjectSearch from '../../shared/ProjectSearch';
    import reportService from '../../../services/report.service';
    import eventBus from '../../../eventBus';
    import clickBlocker from '../../../common/click-blocker';    
    import { globalStore } from './../../../main';

    export default {
        name: 'AllReports',

        components: {
            UserDetails,
            EnvironmentSearch,
            ModuleSearch,
            ProjectSearch,
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
        },

        mounted() {
            eventBus.$on('projectChanged', (project) => { 
                this.module = {};  
                globalStore.store.reviewBug.module = {};
                this.project = project;
            });
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
                project: {}
            }
        },

        methods: {

            async getReports(){
                if(!this.validateForm()) return false;
                console.log(this.environment, this.module, this.from, this.to);
                try {
                    this.reports = await this.get(this.account, this.environment.environmentId, this.module.moduleId, this.from, this.to)
                    this.showElements()
                } catch(error) {
                    console.log(error);
                }                   
                
            },

            validateForm(){
                this.count = 0;
                this.reports = [];

                if(!this.$refs.environmentForm.formValidation()) this.count++;                  
                if(!this.$refs.moduleForm.formValidation()) this.count++;
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

            showDetails(index) {
                this.$emit('show-details', index);
            },

            showElements(){
                console.log(this.reports);
                for (let index = 0; index < this.reports.length; index++) {
                    this.selectElement(index); 
                    if(index == this.reports.length - 1) {
                        const els = document.querySelectorAll('.ui-br-ext-outlined-element');
                        this.addClickBlocker(els);
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
                    console.log(this.reports);
                    eventBus.$on('report-loaded');
                }
            },
        }
    }
</script>