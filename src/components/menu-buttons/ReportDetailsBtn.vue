<template>
    <span class="ui-br-ext-operator ui-br-ext-alwaysOn" id="ui-br-ext-reportdetails-button" 
    style="height: 0px;width: 0px !important;margin: 0!important;padding: 0!important;" ref="detailsButton" >
                
            </span>
</template>

<script>

    
    import eventBus from './../../eventBus';

    export default {
        name: 'ReportDetailsBtn',
        
        props: ['toggleCompleted'],

        mounted: function () {
            eventBus.$on('toggle-drop', (val) => {
                this.toggleBtn(this.$refs.detailsButton)
            });
        },

        data() {
            return {
                next: false
            }
        },

        methods: {

            toggleBtn(el) {
                this.$emit('toggle-button', el);
            },
        }
    }
</script>