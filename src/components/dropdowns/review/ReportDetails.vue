<template>
    <div >  
        <div class="ui-br-ext-close-details" @click="close">Close</div>  
        <div  class="ui-br-ext-review-card" v-if="report">

            <ModuleDetails :module="module" />
            <UserDetails :user="report.user" />

            <div class="ui-br-ext-review-box" v-if="report.content.description">
                <div class="ui-br-ext-review-title">Description:</div>
                <div class="ui-br-ext-review-text">{{report.content.description}}</div>
            </div>
            <div class="ui-br-ext-review-box" v-if="report.content.stepsToReproduce">
                <div class="ui-br-ext-review-title">Steps to reproduce:</div>
                <div class="ui-br-ext-review-text">{{report.content.stepsToReproduce}}</div>
            </div>
            <div class="ui-br-ext-review-box" v-if="report.content.actualResults">
                <div class="ui-br-ext-review-title">Actual results:</div>
                <div class="ui-br-ext-review-text">{{report.content.actualResults}}</div>
            </div>
            <div class="ui-br-ext-review-box" v-if="report.content.expectedResults">
                <div class="ui-br-ext-review-title">Expected results:</div>
                <div class="ui-br-ext-review-text">{{report.content.expectedResults}}</div>
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

    export default {
        name: 'ReportDetails',

        components: {
            ModuleDetails,
            UserDetails
        },

        props: [
            'report', 
            'module'
        ],

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

            pdf() {
                console.log('download pdf');
            },

            close(){
                this.$emit('close-details')
            },

            edit() {
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