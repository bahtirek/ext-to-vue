<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-report-bug" id="ui-br-ext-report-bug" ref="divToResize">
        <div class="ui-br-ext-drop-title">Report bug</div>
        <div class="ui-br-ext-drop-body">

            <ModuleDetails :module="currentModule" />

            <UserDetails :user="user" />

            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-description">Description</label>
                <textarea name="ui-br-ext-description" v-model="form.description" rows="2" data-gramm="false"></textarea>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-act-results">Actual results</label>
                <textarea name="ui-br-ext-act-results" v-model="form.actualResults" rows="3" data-gramm="false"></textarea>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-exp-results">Expected results</label>
                <textarea name="ui-br-ext-exp-results" v-model="form.expectedResults" rows="3" data-gramm="false"></textarea>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-rep-steps">Steps to reproduce</label>
                <textarea name="ui-br-ext-rep-steps" v-model="form.stepsToReproduce" rows="3" data-gramm="false"></textarea>
            </div>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-checkbox" v-if="account && account.registrationKey">
            <input type="checkbox" name="jira" id="ui-br-ext-save-to-jira" v-model="form.saveJira">
            <label for="ui-br-ext-save-to-jira">Create Jira ticket on save</label>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-checkbox">
            <input type="checkbox" name="pdf" id="ui-br-ext-save-to-pdf" v-model="form.savePdf">
            <label for="ui-br-ext-save-to-pdf">Save as PDF</label>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-checkbox">
            <input type="checkbox" name="screenshot" id="ui-br-ext-save-to-screenshot" v-model="form.saveScreenshot">
            <label for="ui-br-ext-save-to-screenshot">Attach screenshot</label>
            <span class="ui-br-ext-disclaimer">Make sure to remove personal identity information</span>
        </div>
        <button class="ui-br-ext-btn" id="ui-br-ext-save-report" @click="saveReport" data-listener="off">
            <span>Save</span> 
        </button>
        <div class="ui-br-ext-box-resize" id="ui-br-comment-boxResize" @mousedown="onMouseDown" @touchstart="onTouchStart">
            <svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" focusable="false"
                role="img" width="128" height="128" fill="currentColor">
                <path d="M33,11H3a1,1,0,0,0,0,2H33a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-1" />
                <path d="M28,17H8a1,1,0,0,0,0,2H28a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-2" />
                <path d="M23,23H13a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"
                    class="ui-br-ext-clr-i-outline clr-i-outline-path-3" /></svg>
        </div>
        <a href="" ref="downloadImageFull" style="display: none !important;"></a>
    </div>
</template>

<script>

    import screenshot from '../../common/screenshot';
    import exportPdf from '../../common/export-pdf';
    import select from '../../common/select';
    import extensionMove from '../../common/extension-resize';
    import { globalStore } from './../../main';
    import eventBus from './../../eventBus';
    import ModuleDetails from '../shared/ModuleDetails';
    import UserDetails from '../shared/UserDetails';
            
    export default {
        name: 'ReportBugDrop',

        components: {
            ModuleDetails,
            UserDetails
        },
        
        created() { 
            this.onGetScreenshot = screenshot.getScreenshot;
            this.getQueryWidth = screenshot.getQueryWidth;
            this.getFileName = exportPdf.getFileName;
            this.savePdf = exportPdf.savePdf;
            this.mouseMove = extensionMove.onMouseDown;
            this.touchMove = extensionMove.onTouchStart;
            this.getElementXpath = select.getElementXpath;
        },

        mounted: function () {
            this.account = globalStore?.store?.account;
            this.currentModule = globalStore?.store.currentModule;
            this.user = globalStore?.store.user;

            eventBus.$on('account-loaded', (val) => {
                this.account = globalStore.store.account;
                this.currentModule = globalStore.store.currentModule;
            })
                        
            eventBus.$on('user-loaded', () => {
                this.user = globalStore.store.user;
            })
        },

        data() {
            return {
                next: false,
                currentModule: {},
                account: {},
                user: {},
                form: {
                    description: '',
                    actualResults: '',
                    expectedResults: '',
                    stepsToReproduce: '',
                    saveJira: false,
                    savePdf: false,
                    saveScreenshot: false,
                    screenshot: '',
                    xPath: '',
                },
                positions: {
                    clientX: undefined,
                    clientY: undefined,
                    resizeX: 0,
                    resizeY: 0,
                    height: undefined,
                    width: undefined
                },
                filename: '',
                name: 'test'
            }
        },

        methods: {

            async saveReport(){
                
                this.filename = this.getFileName(this.currentModule.name);

                if(this.form.saveScreenshot) {
                    if(!globalStore.store.dynamicDomFlow) {
                        await this.getScreenshot();
                    }
                }

                if(this.form.savePdf){
                    await this.savePdf(this.form, globalStore.store.screenshot, globalStore.store.queryWidth)
                }

                if(this.form.saveScreenshot && !this.form.savePdf){
                    this.screenshotLink(globalStore.store.screenshot, this.filename);
                }

                if(this.form.saveJira){
                    console.log('save jira')
                }

                globalStore.store.report.xPath = this.getElementXpath(globalStore.store.selectedElement);
                
                this.setTempReports();
                this.resetReportData();             
            },

            async getScreenshot(){
                this.$emit('toggle-extension');
                globalStore.store.screenshot = await this.onGetScreenshot();
                globalStore.store.queryWidth = await this.getQueryWidth();
                this.$emit('toggle-extension');
            },

            screenshotLink(dataUrl, filename) {
                let dlLink = this.$refs.downloadImageFull;
                let MIME_TYPE = "image/png";
                dlLink.download = filename;
                dlLink.href = dataUrl;
                dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
                dlLink.click();
            },

            resetReportData(){
                this.form = {
                    description: '',
                    actualResults: '',
                    expectedResults: '',
                    stepsToReproduce: '',
                    saveJira: false,
                    savePdf: false,
                    saveScreenshot: false,
                    screenshot: '',
                    xPath: '',
                };
                globalStore.store.screenshot = '';
                globalStore.store.dynamicDomFlow = false;
                globalStore.store.selectedElement = '';
                globalStore.store.currentElementInlineStyle = '';
                globalStore.store.selectedElementRect = '';
            },

            onMouseDown(event) {
                this.mouseMove(event)
            },

            onTouchStart(event){   
                if(event.path[1]['id'] == 'ui-br-comment-boxResize') {
                    this.touchMove(event)
                }            
            },

            setTempReports(){
                let report = {
                    content: this.form,
                    url: window.location,
                    screenshot: globalStore.store.screenshot,
                    xPath: globalStore.store.report.xPath,
                    user: this.user                   
                }
                globalStore.store.reports.push(report);
                console.log(globalStore.store.reports);
                eventBus.$emit('report-loaded');
            }
        }
    }
</script>

