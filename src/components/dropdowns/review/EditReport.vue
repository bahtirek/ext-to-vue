<template>
    <div > 
        <div class="ui-br-ext-close-details" @click="close">Close</div>  
        <div class="ui-br-ext-spacer-3"></div>
        <ReportForm ref="reportForm" :report="report" :validation="saveToDb" />

        <!-- <ReplaceScreenshot :account="account" ref="replaceScreenshotForm"  /> -->
        <!-- Reselect Element -->
        <FileUpload :account="account" ref="fileUploadForm" :report="report" />

        
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
    import FileUpload from '../../shared/FileUpload';
    import reportService from '../../../services/report.service';

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

        created() { 
            this.patchReport = reportService.patchReport;
        },

        data() {
            return {
                saveToDb: true
            }
        },

        methods: {
            async  formValidation(){
                if(await this.$refs.reportForm.formValidation()) {
                    Object.assign(this.report, this.$refs.reportForm.getReportForm());
                    this.report.attachments = this.$refs.fileUploadForm.getNewUploads();
                    this.saveReport();
                }
            },

            async saveReport(){
                console.log('savereport');
                console.log(this.report);
                try {
                    const result = await this.patchReport(this.account, this.report);
                    console.log(result);
                    if(result.result == 'success'){
                        this.$refs.fileUploadForm.deleteFiles();
                        this.close()
                    } else {
                        alert(`Sorry something went wrong. Please try later`);
                        this.submitInPorgress = false;
                    }                  
                } catch(error) {
                    console.log(error);
                    alert(`Sorry something went wrong. Please try later`);
                    this.submitInPorgress = false;
                }           
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