<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-report-bug" id="ui-br-ext-report-bug" ref="divToResize">
        <div class="ui-br-ext-drop-title">Report bug</div>
        <div class="ui-br-ext-drop-body">

            <ProjectDetails :project="project" />

            <UserDetails :user="user" />

            <div class="ui-br-ext-spacer-3"></div>
            
            <ReportForm ref="reportForm" />

            <FileUpload :account="account" ref="fileUploadForm" />

        </div>
        <div class="ui-br-ext-form-container ui-br-ext-checkbox" v-if="account && account.registrationKey">
            <input type="checkbox" name="jira" id="ui-br-ext-save-to-jira" v-model="saveToDb">
            <label for="ui-br-ext-save-to-jira">Save to DB</label>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-checkbox" v-if="account && account.registrationKey">
            <input type="checkbox" name="jira" id="ui-br-ext-save-to-jira" v-model="report.saveJira">
            <label for="ui-br-ext-save-to-jira">Create Jira ticket on save</label>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-checkbox">
            <input type="checkbox" name="pdf" id="ui-br-ext-save-to-pdf" v-model="report.savePdf">
            <label for="ui-br-ext-save-to-pdf">Save as PDF</label>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-checkbox">
            <input type="checkbox" name="pdf" id="ui-br-ext-send-email" v-model="report.sendEmail">
            <label for="ui-br-ext-send-email">Send email</label>
        </div>
        <div class="ui-br-ext-btn-group">
            <button class="ui-br-ext-btn" id="ui-br-ext-save-report" @click="downloadScreenshot" data-listener="off" >
                <span>Download screenshot</span> 
            </button>
            <button class="ui-br-ext-btn" id="ui-br-ext-save-report" @click="getForm" data-listener="off" :disabled="submitInPorgress" :class="{ disabled: submitInPorgress }">
                <span class="ui-br-ext-spinner" :class="{ active: submitInPorgress }"></span>
                <span>Save report</span> 
            </button>
        </div>

        <Resize :elementId="elementId" />

        <a href="" ref="downloadImageFull" style="display: none !important;"></a>
    </div>
</template>

<script>

    import screenshot from '../../common/screenshot';
    import exportPdf from '../../common/export-pdf';
    import select from '../../common/select';
    import { globalStore } from './../../main';
    import eventBus from './../../eventBus';
    import UserDetails from '../shared/UserDetails';
    import ProjectDetails from '../shared/ProjectDetails';
    import Resize from '../shared/Resize';
    import ReportForm from '../shared/ReportForm';
    import FileUpload from '../shared/FileUpload';
    import email from '../../common/email';
    import reportService from '../../services/report.service'
            
    export default {
        name: 'ReportBugDrop',

        components: {
            UserDetails,
            Resize,
            ReportForm,
            ProjectDetails,
            FileUpload
        },
        
        created() { 
            this.onGetScreenshot = screenshot.getScreenshot;
            this.getQueryWidth = screenshot.getQueryWidth;
            this.getFileName = exportPdf.getFileName;
            this.savePdf = exportPdf.savePdf;
            this.getElementXpath = select.getElementXpath;
            this.sendEmail = email.sendEmail;
            this.postBlob = reportService.postBlob;
            this.postReport = reportService.postReport;
        },

        mounted: function () {
            this.account = globalStore?.store?.account;
            this.currentModule = globalStore?.store.currentModule;
            this.user = globalStore?.store.user;
            this.project = globalStore?.store.project;

            eventBus.$on('account-loaded', (val) => {
                this.account = globalStore.store.account;
                this.currentModule = globalStore.store.currentModule;
                this.project = globalStore.store.project;
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
                project: {},
                report: {
                    description: '',
                    actualResults: '',
                    expectedResults: '',
                    stepsToReproduce: '',
                    saveJira: false,
                    savePdf: false,
                    sendEmail: false,
                    saveScreenshot: false,
                    screenshot: '',
                    xPath: '',
                    queryWidth: undefined,
                    url: '',
                    user: {}
                },
                saveToDb: true,
                filename: '',
                name: 'test',
                elementId: 'ui-br-ext-report-bug',
                submitInPorgress: false
            }
        },

        methods: {

            async getForm(){

                if(this.saveToDb) {
                    const isValid = await this.$refs.reportForm.formValidation();
                    if(!isValid) return false;   
                }

                Object.assign(this.report, this.$refs.reportForm.getReportForm());
                
                this.saveReport();
            },

            async saveReport(){
                this.submitInPorgress = true;

                this.filename = this.getFileName(this.currentModule.name);

                if(!globalStore.store.dynamicDomFlow) {
                    await this.getScreenshot();
                    console.log(this.report.screenshot);
                } else {
                    this.report.screenshot = globalStore.store.screenshot;
                    this.report.queryWidth = globalStore.store.queryWidth;
                }

                if(this.report.saveScreenshot) {
                    this.screenshotLink(this.report.screenshot, this.filename);
                }

                if(this.report.savePdf){
                    await this.savePdf(this.report)
                }

                if(this.report.saveJira){
                    console.log('save jira')
                }

                if(this.report.sendEmail){
                    await this.sendEmail(this.report)
                }
                
                this.report.xPath = this.getElementXpath(globalStore.store.selectedElement);

                this.report.url = window.location;

                this.report.user = this.user;

                this.report.attachments = this.$refs.fileUploadForm.getFiles();
                console.log(this.report);
                
                if(this.saveToDb) {
                    this.submitReport();
                } 
                this.submitInPorgress = false;         
            },

            async getScreenshot(){
                this.$emit('toggle-extension');
                this.report.screenshot = await this.onGetScreenshot();
                this.report.queryWidth = await this.getQueryWidth();
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

            async downloadScreenshot() {
                const filename = this.getFileName(this.currentModule.name);
                let dataUrl = globalStore.store.screenshot;

                if(!globalStore.store.dynamicDomFlow) {
                    await this.getScreenshot();
                    dataUrl = this.report.screenshot;
                } 

                this.screenshotLink(dataUrl, filename);
            },

            resetReportData(){
                this.report = {
                    description: '',
                    actualResults: '',
                    expectedResults: '',
                    stepsToReproduce: '',
                    saveJira: false,
                    savePdf: false,
                    saveScreenshot: false,
                    screenshot: '',
                    xPath: '',
                    url: '',
                    queryWidth: 550,
                    attachments: []
                };
                globalStore.store.screenshot = '';
                globalStore.store.dynamicDomFlow = false;
                globalStore.store.selectedElement = '';
                globalStore.store.currentElementInlineStyle = '';
                globalStore.store.selectedElementRect = '';
                this.$refs.reportForm.resetReportData();
                this.submitInPorgress = false;
                eventBus.$emit('toggle-bug-drop', false);
            },

            async submitReport(){
                console.log('currentModule', this.currentModule);
                
                try {
                    const report = await this.postReport(this.account, this.report);

                    console.log(report);
                    if(report.result.bugId){
                        alert('Bug report successfully created.')
                        this.resetReportData();
                    } else {
                        alert(`Sorry something went wrong. Please try later`);
                        this.submitInPorgress = false;
                    }                  
                } catch(error) {
                    console.log(error);
                    alert(`Sorry something went wrong. Please try later`);
                    this.submitInPorgress = false;
                }
            }
        }
    }
</script>

