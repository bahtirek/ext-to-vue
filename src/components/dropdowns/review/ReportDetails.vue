<template>
    <div >  
        <div class="ui-br-ext-close-details" @click="close">Close</div>  
        <div  class="ui-br-ext-review-card" v-if="report">
            <div class="ui-br-ext-review-box" v-if="report.sameElementBugs">
                <div class="ui-br-ext-review-title">Other bugs for this element:</div>
                <div class="ui-br-ext-review-text">
                    <a v-for="(bug, index) in report.sameElementBugs" :key="index" target="_blank" @click="getDetails(bug.bugId)">
                        {{bug.bugIndex}}
                    </a> &nbsp;&nbsp;
                </div>
            </div>

            
            <div class="ui-br-ext-review-box" v-if="report.projectName">
                <div class="ui-br-ext-review-title">Project:</div>
                <div class="ui-br-ext-review-text ui-br-ext-capitalize">{{report.projectName}}</div>
            </div>
            <div class="ui-br-ext-review-box" v-if="report.moduleName">
                <div class="ui-br-ext-review-title">Module:</div>
                <div class="ui-br-ext-review-text ui-br-ext-capitalize">{{report.moduleName}}</div>
            </div>
            <div class="ui-br-ext-review-box" v-if="report.bugEnvironment">
                <div class="ui-br-ext-review-title">Environment:</div>
                <div class="ui-br-ext-review-text ui-br-ext-capitalize">{{report.bugEnvironment}}</div>
            </div>

            <div class="ui-br-ext-spacer-1"></div>

            <div class="ui-br-ext-review-box"  v-if="report.created_at">
                <div class="ui-br-ext-review-title">Created:</div>
                <div class="ui-br-ext-review-text ui-br-ext-capitalize">{{new Date(report.created_at).toLocaleString()}}</div>
            </div>
            <div class="ui-br-ext-review-box"  v-if="report.updated_at">
                <div class="ui-br-ext-review-title">Last updated:</div>
                <div class="ui-br-ext-review-text ui-br-ext-capitalize">{{new Date(report.updated_at).toLocaleString()}}</div>
            </div>
            <div class="ui-br-ext-review-box"  v-if="userEmail">
                <div class="ui-br-ext-review-title">Created by:</div>
                <div class="ui-br-ext-review-text">{{userEmail}}</div>
            </div>
            
            <div class="ui-br-ext-spacer-1"></div>

            <div class="ui-br-ext-review-box" v-if="report.lkBugStatus">
                <div class="ui-br-ext-review-title">Status:</div>
                <div class="ui-br-ext-review-text ui-br-ext-capitalize">{{report.lkBugStatus}}</div>
            </div>

            <div class="ui-br-ext-spacer-1"></div>

            <div class="ui-br-ext-review-box" v-if="report.bugIndex">
                <div class="ui-br-ext-review-title">Bug ID:</div>
                <div class="ui-br-ext-review-text">{{report.bugIndex}}</div>
            </div>
            <div class="ui-br-ext-review-box" v-if="report.title">
                <div class="ui-br-ext-review-title">Summary:</div>
                <div class="ui-br-ext-review-text">{{report.title}}</div>
            </div>
            <div class="ui-br-ext-review-box ui-br-ext-pre" v-if="report.description">
                <div class="ui-br-ext-review-title">Description:</div>
                <pre class="ui-br-ext-review-text">{{report.description}}</pre>
            </div>
            <div class="ui-br-ext-review-box ui-br-ext-pre" v-if="report.stepsToReproduce">
                <div class="ui-br-ext-review-title">Steps to reproduce:</div>
                <pre class="ui-br-ext-review-text">{{report.stepsToReproduce}}</pre>
            </div>
            <div class="ui-br-ext-review-box ui-br-ext-pre" v-if="report.actualResult">
                <div class="ui-br-ext-review-title">Actual results:</div>
                <pre class="ui-br-ext-review-text">{{report.actualResult}}</pre>
            </div>
            <div class="ui-br-ext-review-box ui-br-ext-pre" v-if="report.expectedResult">
                <div class="ui-br-ext-review-title">Expected results:</div>
                <pre class="ui-br-ext-review-text">{{report.expectedResult}}</pre>
            </div>
            <!-- <div class="ui-br-ext-review-box ui-br-ext-pre" v-if="report.jiraLink">
                <div class="ui-br-ext-review-title">Jira link:</div>
                <div class="ui-br-ext-review-text"><a>{{report.expectedResult}}</a></div>
            </div> -->
            <div class="ui-br-ext-review-box" v-if="report.attachments">
                <div class="ui-br-ext-review-title">Attachments:</div>
                <div class="ui-br-ext-review-text">
                    <a v-for="(attachment, index) in report.attachments" :key="index" target="_blank" :href="attachment.path">
                        {{attachment.fileName}}
                    </a> &nbsp;&nbsp;
                </div>
            </div>
            
            <div class="ui-br-ext-svg-cont">
                <span class="ui-br-ext-btn-svg btn-svg-screenshot" @click="viewScreenshot" data-title="View screenshot"></span>
                <span class="ui-br-ext-btn-svg btn-svg-jiraLink" v-if="report.jiraTicketUrl" @click="reviewJira" data-title="Review Jira"></span>
                <span class="ui-br-ext-btn-svg btn-svg-reselect" @click="reselect" data-title="Reselect element"></span>
                <span class="ui-br-ext-btn-svg btn-svg-status" @click="statusUpdate" data-title="Status update"></span>
                <span class="ui-br-ext-btn-svg btn-svg-edit" @click="edit" data-title="Edit"></span>
                <span class="ui-br-ext-btn-svg btn-svg-pdf" @click="pdf" data-title="PDF"></span>
                <span class="ui-br-ext-btn-svg btn-svg-mail"  @click="createEmail" data-title="Email"></span>
                <span class="ui-br-ext-btn-svg btn-svg-createJira" v-if="!report.jiraTicketUrl && report.projectJiraId" @click="createJira" data-title="Create Jira"></span>
            </div >
        </div>
    </div>
</template>

<script>

    import exportPdf from '../../../services/pdf.service';
    import outline from '../../../services/outline.service';
    import reportService from '../../../services/report.service';
    import userService from '../../../services/user.service';
    import email from '../../../common/email';
    import eventBus from '../../../eventBus';
    import { globalStore } from '../../../main';

    export default {
        name: 'ReportDetails',

        components: {
        },

        props: [
            'bugId',
            'account',
            'sharedReports'
        ],

        created() { 
            this.get = reportService.getReportDetails;
            this.getUser = userService.getUserId;
            this.postJira = reportService.postJira;
            this.getScreenshotBlob = reportService.getScreenshotBlob;
            this.getPdf = exportPdf.getPdf;
            this.removeBugCoverEls = outline.removeBugCoverEls;
            this.removeOutline = outline.removeOutline;
            this.outlineElement = outline.outlineElement;
            this.sendEmail = email.sendEmail;
        },

        mounted() { 
            this.getDetails(this.bugId)
        },

        watch: {
            bugId: {
                handler: function(newVal, oldVal){
                    this.getDetails(newVal);
                }
            }
        },

        data() {
            return {
                filename: '',
                report: {
                    screenshots: []
                },
                screenshot: '',
                userEmail: ''
            }
        },

        methods: {

            viewScreenshot(){
                if(this.report.screenshots[0]) window.open(this.report.screenshots[0], '_blank');
            },

            reselect(){
                this.$emit('reselect', this.report)
            },

            async getDetails(bugId){
                try {
                    const report = await this.get(this.account, bugId);
                    this.report = report;
                    this.getUserDetails();
                    this.sharedReports.forEach((report) => {
                        const sameXpath = this.sharedReports.filter((item) => {
                                return (item.xpath == this.report.xpath) && (item.bugId != this.report.bugId)
                            }).map((item) => { 
                                return {bugId: item.bugId, bugIndex: item.bugIndex}
                            });
                        if (sameXpath && sameXpath.length > 0) this.report['sameElementBugs'] = sameXpath;
                    })
                } catch(error) {
                    console.log(error);
                }
            },

            async getUserDetails(){
                try {
                    this.userEmail = await this.getUser(this.account, this.report.createdById)
                } catch (error) {
                    console.log(error);
                    if(error.result?.message) {
                        eventBus.$emit('toggle-toast', { text: error.result?.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }
                }
            },

            reviewJira(){
                window.open(this.report.jiraTicketUrl, '_blank');
            },
            async createJira(){
                try {
                    const result = await this.postJira(this.account, this.report.bugId);
                    this.getDetails(this.report.bugId)                 
                } catch(error) {
                    console.log(error);
                    if(error.result?.message) {
                        eventBus.$emit('toggle-toast', { text: error.result?.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }
                }
            },

            async setReportForPdfEmail() {
                this.removeBugCoverEls();
                this.removeOutline();
                if (this.report.xpath) this.outlineElement(this.report.xpath)
                await this.getScreenshot(); 
                this.setProjectModuleEnvObjects();
            },

            async pdf() { 
                await this.getScreenshot();
                this.setProjectModuleEnvObjects();
                this.submitPdf();
            },

            async submitPdf(){               
                try {
                    const result = await this.getPdf(this.report, this.account);
                    window.open(result, '_blank');
                                     
                } catch(error) {
                    console.log(error);
                    if(error.result?.message) {
                        eventBus.$emit('toggle-toast', { text: error.result?.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }
                }
            },

            close(){
                document.querySelectorAll('.ui-br-ext-selected-element-outline-green').forEach(element => {
                    element.classList.remove('ui-br-ext-selected-element-outline-green');
                    element.classList.add('ui-br-ext-selected-element-outline-red');
                });
                this.$emit('close-details')
            },

            edit() {
                this.setProjectModuleEnvObjects()
                this.$emit('edit-report', this.report)
            },

            setProjectModuleEnvObjects(){
                this.report.project = {id: this.report.projectId, projectKey: this.report.projectName};
                this.report.environment = {environmentId: this.report.bugEnvironmentId, name: this.report.bugEnvironment};
                this.report.module = {moduleId: this.report.moduleId, name: this.report.moduleName};
            },

            deleteReport(){
                const deleteConfirmation = confirm('Are you sure?');
                if (deleteConfirmation) {
                    this.$emit('delete-report', this.report)
                }
            },

            statusUpdate() {
                this.$emit('status-update', this.report)
            },

            async getScreenshot(){
                try {
                    this.report.screenshot = 'data:image/png;base64,' + await this.getScreenshotBlob(this.account, this.report.bugId);
                } catch(error) {
                    console.log(error);
                }
            },

            async createEmail(){
                await this.getScreenshot();
                this.setProjectModuleEnvObjects();
                await this.sendEmail(this.report)
            }
        }
    }
</script>