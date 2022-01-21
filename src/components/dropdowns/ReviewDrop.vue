<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-review" id="ui-br-ext-review" ref="divToResize">
        <div class="ui-br-ext-drop-title">Reports</div>
        <div class="ui-br-ext-drop-body">

            <ModuleDetails v-if="toggle.allReports" :module="currentModule" />

            <AllReports v-if="toggle.allReports" @show-details="showDetails" :reports="reports"/>

            <ReportDetails v-if="toggle.details" @close-details="closeDetails" @delete-report="deleteReport" :report="report" :module="currentModule" />

        </div>
        <div class="ui-br-ext-box-resize" id="ui-br-review-reviewResize" @mousedown="onMouseDown" @touchstart="onTouchStart">
            <svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" focusable="false"
                role="img" width="128" height="128" fill="currentColor">
                <path d="M33,11H3a1,1,0,0,0,0,2H33a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-1" />
                <path d="M28,17H8a1,1,0,0,0,0,2H28a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-2" />
                <path d="M23,23H13a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-3" /></svg>
        </div>
    </div>
</template>


<script>

    import { globalStore } from './../../main';
    import eventBus from './../../eventBus';
    import extensionMove from '../../common/extension-resize';
    import AllReports from './review/AllReports';
    import ReportDetails from './review/ReportDetails';
    import ModuleDetails from '../shared/ModuleDetails';
    import clickBlocker from '../../common/click-blocker';

    export default {
        name: 'ReviewDrop',

        components: {
            AllReports,
            ReportDetails,
            ModuleDetails
        },

        created() { 
            this.mouseMove = extensionMove.onMouseDown;
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
                positions: {
                    clientX: undefined,
                    clientY: undefined,
                    resizeX: 0,
                    resizeY: 0,
                    height: undefined,
                    width: undefined
                },
                report: undefined,
                toggle: {
                    allReports: true,
                    details: false
                }
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

            onMouseDown(event) {
                this.mouseMove(event)
            },

            onTouchStart(event){   
                if(event.path[1]['id'] == 'ui-br-comment-reviewResize') {
                    this.touchMove(event)
                }            
            },
        }
    }
</script>