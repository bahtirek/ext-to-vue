<template>
    <div>
        <ModuleDetails :module="currentModule" />
        <div class="ui-br-ext-review-card" v-for="(report, index) in reportsToDisplay" :key="index">
            
            <UserDetails :user="report.user" />

            <div class="ui-br-ext-review-box ui-br-ext-ellipsis" v-if="report.description" @click="showDetails(index)">
                <div class="ui-br-ext-review-title">Description:</div>
                <div class="ui-br-ext-review-text">{{report.description}}</div>
            </div>
            <span class="ui-br-ext-btn-lnk" v-if="report.screenshot" @click="showImage(report.screenshot)">Screenshot</span>
        </div>
    </div>
</template>

<script>

    import UserDetails from '../../shared/UserDetails';
    import ModuleDetails from '../../shared/ModuleDetails';

    export default {
        name: 'AllReports',

        components: {
            UserDetails,
            ModuleDetails
        },
        
        props: [
            'reports',
            'currentModule'
        ],

        mounted() {
            this.reportsToDisplay = this.reports.filter(report => !report.element);
        },

        data() {
            return {
                reportsToDisplay: []
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

            showDetails(index) {
                this.$emit('show-details', index);
            },
        }
    }
</script>