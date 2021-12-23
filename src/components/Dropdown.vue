
<template>
    <div class="ui-br-ext-container ui-br-ext-dropdown">
        <ReportBugDrop  v-show="drops.reportbug" @toggle-extension="$emit('toggle-extension')"/>
        <SettingsDrop v-show="drops.settings" />
    </div>
</template>

<script>

    import ReportBugDrop from './dropdowns/ReportBugDrop';
    import SettingsDrop from './dropdowns/SettingsDrop';

    export default {
        name: 'Dropdown',
        components: {
            ReportBugDrop,
            SettingsDrop
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