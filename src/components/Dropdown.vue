
<template>
    <div class="ui-br-ext-container ui-br-ext-dropdown">
        <ReportBugDrop v-show="drops.reportbug" />
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
            dropToToggle: function(newVal, oldVal) { // watch it
                console.log('Prop changed: ', newVal, ' | was: ', oldVal)
                this.toggleDropdown(newVal.id, newVal.state);
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

            toggleDropdown(id, state) {
                this.drops[id] = state;
            },         
        }
    }
</script>