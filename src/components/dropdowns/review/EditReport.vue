<template>
    <div > 

        <ReportForm ref="reportForm" :report="report.content" />

        <button class="ui-br-ext-btn" id="ui-br-ext-save-report" @click="saveReport" data-listener="off">
            <span>Save</span> 
        </button>

    </div>
</template>


<script>

    
    import ReportForm from '../../shared/ReportForm';

    export default {
        name: 'ReviewDrop',

        components: {
            ReportForm
        },

        props: [
            'report'
        ],

        data() {
            return {
            }
        },

        methods: {

            async saveReport(){
                this.reportForm();
                
                console.log(this.form);
                this.$emit('save-edited-report', { content: this.$refs.reportForm.form, xPath: this.report.xPath} )            
            },

            reportForm() {            
                this.report.content.description = this.$refs.reportForm.form.description,
                this.report.content.actualResults = this.$refs.reportForm.form.actualResults,
                this.report.content.expectedResults = this.$refs.reportForm.form.expectedResults,
                this.report.content.stepsToReproduce = this.$refs.reportForm.form.stepsToReproduce  
            }
        }
    }
</script>