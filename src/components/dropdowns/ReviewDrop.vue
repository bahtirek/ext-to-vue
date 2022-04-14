<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-review" id="ui-br-ext-review" ref="divToResize">
        <div class="ui-br-ext-drop-title">Reports</div>
        <div class="ui-br-ext-drop-body">

            <AllReports v-if="toggle.allReports" @show-details="showDetails"  :projectId="project.id" :account="account" />

            <ReportDetails v-if="toggle.details" @close-details="closeDetails" @delete-report="deleteReport" @edit-report="editReport" :project="project" :report="report" :module="currentModule" />

            <EditReport v-if="toggle.edit" :report="report" @save-edited-report="saveEditedReport" @cancel-edit-report="cancelEditReport" />

        </div>
        
        <Resize :elementId="elementId" />

    </div>
</template>


<script>

    import { globalStore } from './../../main';
    import eventBus from './../../eventBus';
    import AllReports from './review/AllReports';
    import ReportDetails from './review/ReportDetails';
    import clickBlocker from '../../common/click-blocker';
    import Resize from '../shared/Resize';
    import EditReport from './review/EditReport';

    export default {
        name: 'ReviewDrop',

        components: {
            AllReports,
            ReportDetails,
            Resize,
            EditReport
        },

        created() { 
            this.addClickBlocker = clickBlocker.addClickBlocker;         
            this.removeSingleClickBlocker = clickBlocker.removeSingleClickBlocker;               
            this.removeClickBlocker = clickBlocker.removeClickBlocker;               
        },

        mounted: function () {
            this.reports = globalStore.store.reports;
            this.currentModule = globalStore?.store.currentModule;
            this.project = globalStore.store.project;
            this.account = globalStore.store.account;
            this.showElements();

            eventBus.$on('show-details', (index) => {
                this.showDetails(index)
            });
        },

        data() {
            return {
                ifModule: false,
                ifAccount: false,
                ifUser: false,
                currentModule: {},
                account: {},
                reports: [],
                report: undefined,
                project: {},
                toggle: {
                    allReports: true,
                    details: false,
                    edit: false
                },
                elementId: 'ui-br-ext-review'
            }
        },

        methods: {

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
                let element = document.evaluate(report.xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
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

            closeDetails() {
                this.toggleChildren('allReports')
            },

            showDetails(index) {
                this.report = this.reports[index];
                this.toggleChildren('details');
            },

            showImage(screenshot) {
                if(screenshot) {
                    let image = new Image();
                    image.src = screenshot;

                    let w = window.open("");
                    w.document.write(image.outerHTML);
                }
            },

            cancelEditReport() {
                this.toggleChildren('details');
            },

            toggleChildren(child) {
                Object.keys(this.toggle).forEach(key => {
                    if(key == child) {
                        this.toggle[key] = true
                    } else {
                        this.toggle[key] = false
                    }
                })
            }
        }
    }
</script>