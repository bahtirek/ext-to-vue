<template>
    <div > 

        <ReportForm ref="reportForm" :report="report" />

        
        <div class="ui-br-ext-btn-group">
            <button class="ui-br-ext-btn" id="ui-br-ext-save-report" @click="saveReport" data-listener="off">
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
                Object.assign(this.report, this.$refs.reportForm.form);
                this.$emit('save-edited-report', this.report );            
            },

            cancel(){
                this.$emit('cancel-edit-report')            
            }
        }
    }
</script>