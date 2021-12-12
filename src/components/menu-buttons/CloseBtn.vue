<template>
    <span class="ui-br-ext-operator ui-br-ext-alwaysOn" data-title="Close" @click="toggleBtn"  id="ui-br-ext-close-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f04242" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" class="ui-br-ext-feather feather-x">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" /></svg>
            </span>
</template>

<script>

    //import operators from '../../shared/operators';

    export default {
        name: 'CloseBtn',
        
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