
<template>
    <div class="ui-br-ext-container ui-br-ext-dropdown">
        <ReportBugDrop  v-if="drops.reportbug" @toggle-extension="$emit('toggle-extension')"/>
        <SettingsDrop v-if="drops.settings" />
        <ReviewDrop v-if="drops.review"/>
        <VideoRecordDrop v-if="drops.video"/>
    </div>
</template>

<script>

    import ReportBugDrop from './dropdowns/ReportBugDrop';
    import SettingsDrop from './dropdowns/SettingsDrop';
    import ReviewDrop from './dropdowns/ReviewDrop';
    import VideoRecordDrop from './dropdowns/VideoRecordDrop';

    export default {
        name: 'Dropdown',
        components: {
            ReportBugDrop,
            SettingsDrop,
            ReviewDrop,
            VideoRecordDrop
        },
        
        props: [
            'dropToToggle'
        ],

        watch: { 
            dropToToggle: function(newVal, prevVal) { // watch it
                this.toggleDropdown(newVal.id, newVal.state, prevVal.id);
            }
        },

        data() {
            return {
                toggleCompleted: false,
                toggleReportBugDrop: false,
                drops: {
                    reportbug: false,
                    settings: false,
                    review: false,
                    reportdetails: false,
                    video: false
                },
                reportIndex: undefined
            }
        },
        methods: {

            toggleDropdown(id, state, prevId) {
                console.log(id, state, prevId);
                this.drops[prevId] = false;
                this.drops[id] = state;
            }, 
        }
    }
</script>