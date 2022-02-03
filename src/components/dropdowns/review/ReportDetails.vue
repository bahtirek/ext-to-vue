<template>
    <div >  
        <div class="ui-br-ext-close-details" @click="close">Close</div>  
        <div  class="ui-br-ext-review-card" v-if="report">
            <ProjectDetails :project="project" />
            <ModuleDetails :module="module" />
            <UserDetails :user="report.user" />
            <div class="ui-br-ext-spacer-3"></div>
            <div class="ui-br-ext-review-box" v-if="report.description">
                <div class="ui-br-ext-review-title">Description:</div>
                <div class="ui-br-ext-review-text">{{report.description}}</div>
            </div>
            <div class="ui-br-ext-review-box" v-if="report.stepsToReproduce">
                <div class="ui-br-ext-review-title">Steps to reproduce:</div>
                <div class="ui-br-ext-review-text">{{report.stepsToReproduce}}</div>
            </div>
            <div class="ui-br-ext-review-box" v-if="report.actualResults">
                <div class="ui-br-ext-review-title">Actual results:</div>
                <div class="ui-br-ext-review-text">{{report.actualResults}}</div>
            </div>
            <div class="ui-br-ext-review-box" v-if="report.expectedResults">
                <div class="ui-br-ext-review-title">Expected results:</div>
                <div class="ui-br-ext-review-text">{{report.expectedResults}}</div>
            </div>
            <div>
                <span class="ui-br-ext-btn-lnk" v-bind:class="{'disabled': !report.screenshot}" @click="showImage(report.screenshot)">View screenshot</span>
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

    export default {
        name: 'ReportDetails',

        components: {
            ModuleDetails,
            UserDetails,
            ProjectDetails
        },

        props: [
            'report', 
            'module',
            'project'
        ],

        created() { 
            this.getFileName = exportPdf.getFileName;
            this.savePdf = exportPdf.savePdf;
        },

        data() {
            return {
                filename: '',
            }
        },

        methods: {

            showImage(screenshot) {
                if(screenshot) {
                    let image = new Image();
                    image.src = screenshot;

                    let w = window.open("");
                    w.document.write(image.outerHTML);
                }
            },

            addJira(){
                console.log('addjira');
            },

            createJira(){
                console.log('create jira');
            },

            async pdf() {
                this.filename = this.getFileName(this.module.name);
                console.log(this.report);
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