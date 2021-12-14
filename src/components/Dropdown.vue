
<template>
    <div class="ui-br-ext-container ui-br-ext-dropdown">
        <ReportBugDrop v-show="drops.reportbug" @toggle-extension="$emit('toggle-extension')"/>
    </div>
</template>

<script>

    import ReportBugDrop from './dropdowns/ReportBugDrop';

    export default {
        name: 'Dropdown',
        components: {
            ReportBugDrop
        },
        props: [
            'dropToToggle'
        ],

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
                    reportbug: false
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