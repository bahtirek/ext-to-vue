<template>

    <form class="ui-br-ext-report-form">
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-description">Description</label>
            <textarea name="ui-br-ext-description" v-model="form.description" rows="2" data-gramm="false"></textarea>
            <span class="ui-br-ext-message" v-if="count>0 && form.description==''">Field is required</span>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-act-results">Actual results</label>
            <textarea name="ui-br-ext-act-results" v-model="form.actualResults" rows="3" data-gramm="false"></textarea>
            <span class="ui-br-ext-message" v-if="count>0 && form.actualResults==''">Field is required</span>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-exp-results">Expected results</label>
            <textarea name="ui-br-ext-exp-results" v-model="form.expectedResults" rows="3" data-gramm="false"></textarea>
            <span class="ui-br-ext-message" v-if="count>0 && form.expectedResults==''">Field is required</span>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-rep-steps">Steps to reproduce</label>
            <textarea name="ui-br-ext-rep-steps" v-model="form.stepsToReproduce" rows="3" data-gramm="false"></textarea>
            <span class="ui-br-ext-message" v-if="count>0 && form.stepsToReproduce==''">Field is required</span>
        </div>
    </form >

</template>

<script>

    

    export default {
        name: 'ReportForm',

        props: [
            'report'
        ],

        mounted() {
            this.setFormValue()
        },

        data() {
            return {
                form: {
                    description: '',
                    actualResults: '',
                    expectedResults: '',
                    stepsToReproduce: ''
                },
                count: 0,
            }
        },

        methods: {

            setFormValue(){
                if(this.report) {
                    this.form.description= this.report.description || "",
                    this.form.actualResults= this.report.actualResults || "",
                    this.form.expectedResults= this.report.expectedResults || "",
                    this.form.stepsToReproduce= this.report.stepsToReproduce || ""
                }
            },

            resetReportData(){
                this.form = {
                    description: '',
                    actualResults: '',
                    expectedResults: '',
                    stepsToReproduce: ''
                }
            },

            formValidation(){
                this.count = 0;
                return new Promise((resolve, reject) => {  
                    Object.entries(this.form).forEach(([key, val]) => {
                        val = val.trim();
                        this.form[key] = val;
                        console.log(val);
                        if (val == '') {
                            this.count++
                        }
                    });
                    if(this.count == 0) resolve(true)
                    resolve(false)

                })
            }
        }
    }
</script>