<template>
    <div > 

        <ReportForm ref="reportForm" :report="report"/>

        <ReplaceScreenshot :account="account" ref="replaceScreenshotForm"  />
        <FileUpload :account="account" ref="fileUploadForm"  />

        
        <div class="ui-br-ext-btn-group">
            <button class="ui-br-ext-btn" id="ui-br-ext-save-report" @click="formValidation" data-listener="off">
                <span>Save</span> 
            </button>
            <button class="ui-br-ext-btn-danger" @click="cancel" data-listener="off">
                <span class="ui-br-ext-spinner"></span>
                <span>Cancel</span> 
            </button>
        </div>

    </div>
</template>


<script>

    
    import ReportForm from '../../shared/ReportForm';
    import { globalStore } from './../../../main';
    import FileUpload from '../../shared/FileUpload';
    import ReplaceScreenshot from '../../shared/ReplaceScreenshot';

    export default {
        name: 'ReviewDrop',

        components: {
            ReportForm,
            FileUpload,
            ReplaceScreenshot
        },

        mounted() {
            this.account = globalStore?.store?.account;
            console.log(this.report);
        },

        props: [
            'report'
        ],

        data() {
            return {
                account:{}
            }
        },

        methods: {
            async  formValidation(){
                if(await this.$refs.reportForm.formValidation()) {
                    Object.assign(this.report, this.$refs.reportForm.form);
                    this.report.attachments = this.$refs.fileUploadForm.getFiles();
                    this.saveReport();
                }
            },

            async saveReport(){
                Object.assign(this.report, this.$refs.reportForm.form);
                this.$emit('save-edited-report', this.report );            
            },

            cancel(){
                this.$emit('cancel-edit-report')            
            },

            async submitReport(){
                console.log('currentModule', this.currentModule);
                
                try {
                    const report = await this.postReport(this.account, this.currentModule.moduleId, this.report);

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