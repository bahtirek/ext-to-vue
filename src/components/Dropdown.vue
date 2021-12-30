
<template>
    <div class="ui-br-ext-container ui-br-ext-dropdown">
        <ReportBugDrop  v-if="drops.reportbug" @toggle-extension="$emit('toggle-extension')"/>
        <SettingsDrop v-if="drops.settings" />
        <ReviewDrop v-if="drops.review" />
    </div>
</template>

<script>

    import ReportBugDrop from './dropdowns/ReportBugDrop';
    import SettingsDrop from './dropdowns/SettingsDrop';
    import ReviewDrop from './dropdowns/ReviewDrop';

    export default {
        name: 'Dropdown',
        components: {
            ReportBugDrop,
            SettingsDrop,
            ReviewDrop
        },
        props: [
            'dropToToggle'
        ],

        mounted() { 
            this.$nextTick(function () {
            
            })
        },

        watch: { 
            dropToToggle: function(newVal, prevVal) { // watch it
                this.toggleDropdown(newVal.id, newVal.state, prevVal.id);
            }
        },
        
        created() { 
            
        },
        data() {
            return {
                toggleCompleted: false,
                toggleReportBugDrop: false,
                drops: {
                    reportbug: false,
                    settings: false,
                    review: false
                }
            }
        },
        methods: {

            toggleDropdown(id, state, prevId) {
                this.drops[prevId] = false;
                this.drops[id] = state;
            },         
        }
    }
</script>