<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-review" id="ui-br-ext-review" ref="divToResize">
        <div class="ui-br-ext-drop-title-wrap">
            <div class="ui-br-ext-drop-title">Reports</div>   
            <MinimizeDropBody v-model="showHide" class="ui-br-ext-minimizedropbody2" />
        </div>
        <div v-show="showHide" id="ui-br-ext-review-body">
            <div class="ui-br-ext-drop-body" v-if="account && account.token">
    
                <AllReports v-if="toggle.allReports" :sharedReports="reports" @show-details="showDetails" @setReports="setReports" ref="allReportsRef"/>
    
                <ReportDetails v-if="toggle.details" :sharedReports="reports" @reselect="showReselect" @status-update="showStatusUpdate" @edit-report="showEditReport" @close-details="closeDetails" :bugId="bugId" :account="account" />
    
                <StatusChoice v-if="toggle.status" @close-status="closeStatus" :report="report" :account="account" />
    
                <Reselect v-if="toggle.reselect" @close-reselect="closeReselect" @reselected="updateReportOnReselect" :report="report" :account="account" @toggle-extension="$emit('toggle-extension')" />
    
                <EditReport v-if="toggle.edit" :report="report" @cancel-edit-report="cancelEditReport"  :account="account" />
    
            </div>
            <div class="ui-br-ext-drop-body"  v-if="!(account && account.token)">
    
                <p>Report for users with Account</p>
                <p>Features:</p>
    
            </div>
            <Resize :elementId="elementId" />

        </div>

    </div>
</template>


<script>

    import { globalStore } from './../../main';
    import eventBus from './../../eventBus';
    import AllReports from './review/AllReports';
    import ReportDetails from './review/ReportDetails';
    import StatusChoice from './review/StatusChoice';
    import clickBlocker from '../../common/click-blocker';
    import Resize from '../shared/Resize';
    import EditReport from './review/EditReport';
    import Reselect from './review/Reselect';
    import MinimizeDropBody from '../shared/MinimizeDropBody';
    import outline from '../../services/outline.service';

    export default {
        name: 'ReviewDrop',

        components: {
            AllReports,
            ReportDetails,
            Resize,
            EditReport,
            StatusChoice,
            Reselect,
            MinimizeDropBody
        },

        created() { 
            this.addClickBlocker = clickBlocker.addClickBlocker;         
            this.removeSingleClickBlocker = clickBlocker.removeSingleClickBlocker;               
            this.removeClickBlocker = clickBlocker.removeClickBlocker;  
            this.account = globalStore.store.account;
            this.outlineElement = outline.outlineElement;             
        },

        mounted: function () {
            this.currentModule = globalStore?.store.currentModule;
            this.project = globalStore.store.project;
            this.displayNewBug()

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
                    edit: false,
                    status: false,
                    reselect: false
                },
                elementId: 'ui-br-ext-review-body',
                bugId: undefined,
                projectId: undefined,
                showHide: true
            }
        },

        methods: {

            closeDetails() {
                this.toggleChildren('allReports')
            },

            showDetails(bugId) {
                this.bugId = bugId;
                this.toggleChildren('details');
            },

            showEditReport(report) {
                this.bugId = report.bugId;
                this.report = report;
                this.toggleChildren('edit');
            },

            showStatusUpdate(report) {
                this.bugId = report.bugId;
                this.report = report;
                this.toggleChildren('status');
            },

            showReselect(report) {
                this.report = report;
                this.toggleChildren('reselect');
            },

            closeReselect() {
                this.toggleChildren('details');
            },

            closeStatus() {
                this.toggleChildren('details');
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
            },

            updateReportOnReselect(val) {
                const index = this.reports.findIndex(report => report.bugId == val.bugId);
                this.reports[index]['xpath'] = val.xpath;
                this.outlineElement(val.xpath)              
            },

            setReports(reports) {
                this.reports = reports;
            },

            displayNewBug(){
                if(globalStore.store.bugId) {
                    this.showDetails(globalStore.store.bugId);
                    this.selectElement(globalStore.store.xpath)            
                    globalStore.store.bugId = undefined;
                    globalStore.store.xpath = '';
                }
            },

            selectElement(xpath){
                let element = false;
                try {
                    element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
                } catch(e) {
                    console.log(e)
                }
                if(element){
                    element.classList.add('ui-br-ext-outlined-element');
                    element.classList.add('ui-br-ext-selected-element-outline-red');                               
                }
            }
        }
    }
</script>