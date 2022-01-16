<template>
    <div>
        <div class="ui-br-ext-review-card" v-for="(report, index) in reports" :key="index">
            <ul class="ui-br-ext-info-list" >
                <li v-if="report.user && (report.user.firstname || report.user.lastname)">
                    <span><strong>User: </strong></span>
                    <span> {{report.user.firstname}} {{report.user.lastname}}</span>
                </li >
                <li v-if="report.user && report.user.email">
                    <span><strong>Email: </strong></span>
                    <span> {{report.user.email}}</span>
                </li >
            </ul >
            <div class="ui-br-ext-review-box ui-br-ext-ellipsis" v-if="report.content.description" @click="showDetails(index)">
                <div class="ui-br-ext-review-title">Description:</div>
                <div class="ui-br-ext-review-text">{{report.content.description}}</div>
            </div>
            <span class="ui-br-ext-btn-lnk" v-if="report.screenshot" @click="showImage(report.screenshot)">Screenshot</span>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'AllReports',

        props: [
            'reports'
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

            showDetails(index) {
                this.$emit('show-details', index);
            },
        }
    }
</script>