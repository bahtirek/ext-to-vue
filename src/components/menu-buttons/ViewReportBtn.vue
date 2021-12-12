<template>
    <span class="ui-br-ext-operator ui-br-ext-alwaysOn" data-title="View bug" @click="toggleBtn" id="ui-br-ext-view-bug-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="10 9 9 9 8 9"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    </span>
</template>

<script>

    //import operators from '../../shared/operators';

    export default {
        name: 'ViewReportBtn',
        
        props: ['toggleCompleted'],
        
        created() { 
            //this.onSelect = operators.onSelect;
        },

        data() {
            return {
                next: false
            }
        },

        methods: {

            toggleBtn(e) {
                //this.next = this.activateOperator(e.currentTarget);
                this.$emit('toggle-button', e.currentTarget);
                this.$nextTick(() => {
                    console.log(this.toggleCompleted)
                    if(this.toggleCompleted) {
                        console.log(this.toggleCompleted)
                    }
                })
            },
        }
    }
</script>