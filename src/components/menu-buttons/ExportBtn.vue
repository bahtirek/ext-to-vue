<template>
    <span class="ui-br-ext-operator ui-br-ext-alwaysOn" data-title="Export" @click="toggleBtn" id="ui-br-ext-export-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ui-br-ext-feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </span>
</template>

<script>

    //import operators from '../../common/operators';

    export default {
        name: 'ExportBtn',
        
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