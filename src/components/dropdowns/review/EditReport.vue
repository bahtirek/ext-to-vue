<template>
    <div > 
        <div class="ui-br-ext-close-details" @click="close">Close</div>  
        <div class="ui-br-ext-spacer-3"></div>
        <ReportForm ref="reportForm" :report="report" :validation="saveToDb" />

        <FileUpload :account="account" ref="fileUploadForm" :report="report" />
        
        <div class="ui-br-ext-btn-group">
            <button class="ui-br-ext-btn" id="ui-br-ext-save-report" @click="formValidation" data-listener="off">
            <span class="ui-br-ext-spinner" :class="{ active: submitInPorgress }"></span>
                <span>Save</span> 
            </button>
            <button class="ui-br-ext-btn-danger" @click="cancel" data-listener="off">
                <span>Cancel</span> 
            </button>
        </div>

    </div>
</template>


<script>   
    import ReportForm from '../../shared/ReportForm';
    import FileUpload from '../../shared/FileUpload';
    import reportService from '../../../services/report.service';
    import fileService from '../../../services/file.service';
    import eventBus from '../../../eventBus';


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
            this.delete = fileService.deleteFile;
        },

        data() {
            return {
                saveToDb: true,
                submitInPorgress: false
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
                this.submitInPorgress = true;
                try {
                    await this.patchReport(this.account, this.report);                   
                    const filesToRemove = this.$refs.fileUploadForm.filesToRemove;
                    if(filesToRemove.length > 0) {
                        this.deleteFiles(filesToRemove);
                    } else { 
                        this.close();
                    }
                    this.submitInPorgress = false;                  
                } catch(error) {
                    console.log(error);
                    if(error.result?.message) {
                        eventBus.$emit('toggle-toast', { text: error.result?.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }
                    this.submitInPorgress = false;
                }           
            },

            async deleteFiles(filesToRemove){
                let count = 0
                filesToRemove.forEach(async (uuid) => {
                    count++
                    try {
                        await this.delete(this.account, uuid, this.report.bugId); 
                        if(count == filesToRemove.length)  this.close()                  
                    } catch(e) {
                        console.log(e);
                    } 
                });
            },


            cancel(){
                this.submitInPorgress = false;
                this.$emit('cancel-edit-report')            
            },

            async submitReport(){
                
                try {
                    const report = await this.postReport(this.account, this.currentModule.moduleId, this.report);

                    if(report.result.bugId){
                        this.resetReportData();
                    }                 
                } catch(error) {
                    if(error.result?.message) {
                        eventBus.$emit('toggle-toast', { text: error.result?.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }
                    this.submitInPorgress = false;
                }
            },
            
            close(){
                this.cancel()
            },
        }
    }
</script>