<template>
<span class="ui-br-ext-operator ui-br-ext-alwaysOn" @click="toggleSelect" data-title="Select"  id="ui-br-ext-select-button" ref="selectButton">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" class="ui-br-ext-feather feather-mouse-pointer">
                    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                    <path d="M13 13l6 6" /></svg>
            </span>
</template>

<script>

    import operators from '../shared/operators';
    //import select from './select';

    export default {
        name: 'SelectBtn',

        created() { 
            this.activateOperator = operators.activateOperator;
            this.onSelect = operators.onSelect;
            this.openDropdown = operators.openDropdown;
            this.setOperatorIconStyle = operators.setOperatorIconStyle;
        },

        mounted: function () {
            window.test = this;
        },

        data() {
            return {
                next: false
            }
        },

        methods: {

            toggleSelect(e) {
                this.next = this.activateOperator(e.currentTarget);
                if(this.next){
                   this.onSelect()
                }
            },

            fetchTestData() {
               console.log(this.$refs.selectButton)
               this.next = this.activateOperator(this.$refs.selectButton);
               if(this.next){
                   this.onSelect()
                }
            },
            
        }
    }
</script>