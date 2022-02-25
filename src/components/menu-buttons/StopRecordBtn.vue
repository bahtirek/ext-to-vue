<template>
    <span class="ui-br-ext-operator ui-br-ext-alwaysOn" data-title="Stop Record" @click="stopRecord" id="ui-br-ext-stop-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ui-br-ext-feather ui-bt-ext-stop-button feather-stop-circle"><circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6"/></svg>
    </span>
</template>

<script>

    //import operators from '../../common/operators';

    export default {
        name: 'StopBtn',
        
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

            stopRecord(){
                this.$emit('stop-record')
            }
            
        }
    }
</script>