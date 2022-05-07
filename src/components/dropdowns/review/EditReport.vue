<template>
    <div > 
        <div class="ui-br-ext-close-details" @click="close">Close</div>  
        <div class="ui-br-ext-spacer-3"></div>
        <ReportForm ref="reportForm" :report="report"/>

        <!-- <ReplaceScreenshot :account="account" ref="replaceScreenshotForm"  /> -->
        <!-- Reselect Element -->
        <FileUpload :account="account" ref="fileUploadForm" :attachments="report.attachments" />

        
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

    export default {
        name: 'ReviewDrop',

        components: {
            ReportForm,
            FileUpload,
        },

        props: [
            'report',
            'account'
        ],

        data() {
            return {
                //account:{}
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
                
                try {
                    const report = await this.postReport(this.account, this.currentModule.moduleId, this.report);

                    if(report.result.bugId){
                        alert('Bug report successfully created.')
                        this.resetReportData();
                    } else {
                        alert(`Sorry something went wrong. Please try later`);
                        this.submitInPorgress = false;
                    }                  
                } catch(error) {
                    alert(`Sorry something went wrong. Please try later`);
                    this.submitInPorgress = false;
                }
            },
            
            close(){
                this.cancel()
            },
        }
    }
</script>