<template>

    <form>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-description">Description</label>
            <textarea name="ui-br-ext-description" v-model="form.description" rows="2" data-gramm="false" @blur="onBlur"></textarea>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-act-results">Actual results</label>
            <textarea name="ui-br-ext-act-results" v-model="form.actualResults" rows="3" data-gramm="false" @blur="onBlur"></textarea>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-exp-results">Expected results</label>
            <textarea name="ui-br-ext-exp-results" v-model="form.expectedResults" rows="3" data-gramm="false" @blur="onBlur"></textarea>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-rep-steps">Steps to reproduce</label>
            <textarea name="ui-br-ext-rep-steps" v-model="form.stepsToReproduce" rows="3" data-gramm="false" @blur="onBlur"></textarea>
        </div>
    </form>

</template>

<script>

    

    export default {
        name: 'ReportForm',

        props: [
            'formToEdit'
        ],

        data() {
            return {
                form: {
                    description: '',
                    actualResults: '',
                    expectedResults: '',
                    stepsToReproduce: ''
                },
            }
        },

        methods: {
            onBlur() {
                this.$emit('report-form', this.form)
            },

            resetReportData(){
                this.form = {
                    description: '',
                    actualResults: '',
                    expectedResults: '',
                    stepsToReproduce: ''
                }
            }
        }
    }
</script>