<template>
    <div >  
        <div class="ui-br-ext-close-details" @click="close">Close</div>  
        <div  class="ui-br-ext-review-card" v-if="report">
            <ProjectDetails :project="reviewBug.project" />
            <ModuleDetails :module="reviewBug.module" />
           <!--  <UserDetails :user="report.user" /> -->
            <div class="ui-br-ext-spacer-1"></div>

            <div class="ui-br-ext-review-box" v-if="report.bugIndex">
                <div class="ui-br-ext-review-title">Bug ID:</div>
                <div class="ui-br-ext-review-text">{{report.bugId}}</div>
            </div>
            <div class="ui-br-ext-review-box" v-if="report.title">
                <div class="ui-br-ext-review-title">Title:</div>
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
            <div class="ui-br-ext-review-box" v-if="report.screenshots">
                <div class="ui-br-ext-review-title">Screenshots:</div>
                <div class="ui-br-ext-review-text">
                    <a v-for="(screenshot, index) in report.screenshots" :key="index" target="_blank" :href="screenshot">
                        Image-{{index+1}}
                    </a> &nbsp;&nbsp;
                </div>
            </div>
            <div class="ui-br-ext-review-box" v-if="report.attachments">
                <div class="ui-br-ext-review-title">Attachments:</div>
                <div class="ui-br-ext-review-text">
                    <a v-for="(attachment, index) in report.attachments" :key="index" target="_blank" :href="attachment">
                        Attch-{{index+1}}
                    </a> &nbsp;&nbsp;
                </div>
            </div>
            <div>
                <span class="ui-br-ext-btn-lnk" @click="pdf">Export PDF</span>
                <span class="ui-br-ext-btn-lnk" @click="addJira">Add JIRA ticket</span>
                <span class="ui-br-ext-btn-lnk" @click="createJira">Create JIRA issue</span>
                <span class="ui-br-ext-btn-lnk" @click="edit">Edit report</span>
                <span class="ui-br-ext-btn-lnk" @click="deleteReport">Delete report</span>
            </div>
        </div>
    </div>
</template>

<script>

    import ModuleDetails from '../../shared/ModuleDetails';
    import UserDetails from '../../shared/UserDetails';
    import ProjectDetails from '../../shared/ProjectDetails';
    import exportPdf from '../../../common/export-pdf';
    import reportService from '../../../services/report.service';
    import { globalStore } from './../../../main';

    export default {
        name: 'ReportDetails',

        components: {
            ModuleDetails,
            /* UserDetails, */
            ProjectDetails
        },

        props: [
            'bugId',
            'account',
        ],

        created() { 
            this.getFileName = exportPdf.getFileName;
            this.savePdf = exportPdf.savePdf;
            this.get = reportService.getReportDetails;
            this.reviewBug = globalStore.store.reviewBug;
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
                }
            }
        },

        methods: {

            async getDetails(bugId){
                try {
                    const report = await this.get(this.account, bugId);
                    this.report = report;
                    /* if(reports.length > 0) {
                        this.setReports(reports)
                        this.showElements();
                        this.ifFilter = false;
                        this.ifGlobal = false;
                    } */
                    
                } catch(error) {
                    console.log(error);
                }
            },

            addJira(){
                console.log('addjira');
            },

            createJira(){
                console.log('create jira');
            },

            async pdf() {
                this.filename = this.getFileName('bug');
                await this.savePdf(this.report)
            },

            close(){
                this.$emit('close-details')
            },

            edit() {
                //emits to parent. parent displays edit view
                console.log(this.report);
                this.$emit('edit-report', this.report)
            },

            deleteReport(){
                const deleteConfirmation = confirm('Are you sure?');
                if (deleteConfirmation) {
                    this.$emit('delete-report', this.report)
                }
            }
        }
    }
</script>