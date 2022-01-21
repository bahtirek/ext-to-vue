<template>
    <div>
        <div class="ui-br-ext-review-card" v-for="(report, index) in reportsToDisplay" :key="index">
            
            <UserDetails :user="report.user" />

            <div class="ui-br-ext-review-box ui-br-ext-ellipsis" v-if="report.content.description" @click="showDetails(index)">
                <div class="ui-br-ext-review-title">Description:</div>
                <div class="ui-br-ext-review-text">{{report.content.description}}</div>
            </div>
            <span class="ui-br-ext-btn-lnk" v-if="report.screenshot" @click="showImage(report.screenshot)">Screenshot</span>
        </div>
    </div>
</template>

<script>

    import UserDetails from '../../shared/UserDetails';


    export default {
        name: 'AllReports',

        components: {
            UserDetails
        },
        
        props: [
            'reports'
        ],

        mounted() {
            this.reportsToDisplay = this.reports.filter(report => !report.element);
            console.log(this.reportsToDisplay);
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