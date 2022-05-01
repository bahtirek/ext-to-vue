<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-review" id="ui-br-ext-review" ref="divToResize">
        <div class="ui-br-ext-drop-title">Reports</div>
        <div class="ui-br-ext-drop-body" v-if="account && account.token">

            <AllReports v-if="toggle.allReports" :sharedReports="reports" @show-details="showDetails" @setReports="setReports"/>

            <ReportDetails v-if="toggle.details" :sharedReports="reports" @close-details="closeDetails" :bugId="bugId" :account="account" />

            <EditReport v-if="toggle.edit" :report="report" @save-edited-report="saveEditedReport" @cancel-edit-report="cancelEditReport" />

        </div>
        <div class="ui-br-ext-drop-body"  v-if="!(account && account.token)">

            <p>Report for users with Account</p>
            <p>Features:</p>

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
            this.account = globalStore.store.account;             
        },

        mounted: function () {
            this.currentModule = globalStore?.store.currentModule;
            this.project = globalStore.store.project;

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
                elementId: 'ui-br-ext-review',
                bugId: undefined
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

            setReports(reports) {
                this.reports = reports;
            }
        }
    }
</script>