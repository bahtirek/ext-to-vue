<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-review" id="ui-br-ext-review" ref="divToResize">
        <div class="ui-br-ext-drop-title">Reports</div>
        <div class="ui-br-ext-drop-body">

            <AllReports v-if="toggle.allReports" @show-details="showDetails" :reports="reports" :module="currentModule"/>

            <ReportDetails v-if="toggle.details" @close-details="closeDetails" @delete-report="deleteReport" :report="report" :module="currentModule" />

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

    export default {
        name: 'ReviewDrop',

        components: {
            AllReports,
            ReportDetails,
            Resize
        },

        created() { 
            this.addClickBlocker = clickBlocker.addClickBlocker;         
            this.removeSingleClickBlocker = clickBlocker.removeSingleClickBlocker;               
            this.removeClickBlocker = clickBlocker.removeClickBlocker;               
        },

        mounted: function () {
            this.reports = globalStore.store.reports;
            this.currentModule = globalStore?.store.currentModule;
            this.showElements();

            eventBus.$on('account-loaded', (val) => {
                this.currentModule = globalStore.store.currentModule;
            });

            eventBus.$on('report-loaded', (val) => {
                this.reports = globalStore.store.reports;
            });

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
                this.addClickBlocker();

                for (let index = 0; index < this.reports.length; index++) {
                    this.selectElement(index);                   
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
                    eventBus.$on('report-loaded');
                }
            },

            closeDetails() {
                this.toggle.allReports = true;
                this.toggle.details = false;
            },

            showDetails(index) {
                this.report = this.reports[index];
                this.toggle.allReports = false;
                this.toggle.details = true;
            },

            showImage(screenshot) {
                if(screenshot) {
                    let image = new Image();
                    image.src = screenshot;

                    let w = window.open("");
                    w.document.write(image.outerHTML);
                }
            },

            deleteReport(report) {
                const index = this.reports.findIndex(item => item.xPath == report.xPath);// will change to id
                console.log(index);
                console.log(report);
                this.closeDetails();
                this.reports.splice(index, 1);
                this.removeClickBlocker();
                report.element.classList.remove('ui-br-ext-outlined-element');
                report.element.style.cssText = report.element.style.cssText.replace('outline: red dashed 3px !important;', '');
                report.element.removeAttribute('data-ext-index');
                this.showElements();
            },
        }
    }
</script>