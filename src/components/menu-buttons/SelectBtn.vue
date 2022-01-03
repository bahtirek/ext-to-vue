<template>
<span class="ui-br-ext-operator ui-br-ext-alwaysOn" @click="toggleBtn" data-title="Select"  id="ui-br-ext-select-button" ref="selectButton" >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" class="ui-br-ext-feather feather-mouse-pointer">
                    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                    <path d="M13 13l6 6" /></svg>
            </span>
</template>

<script>

    import operators from '../../shared/operators';
    import { globalStore } from '../../main';
    import screenshot from '../../shared/screenshot';

    export default {
        name: 'SelectBtn',

        props: ['toggleCompleted'],
        
        created() { 
            this.onSelect = operators.onSelect;
            this.onGetScreenshot = screenshot.getScreenshot;
        },

        mounted: function () {
            window.selectButtonComponent = this;
        },

        data() {
            return {
                next: false
            }
        },

        methods: {

            toggleBtn(e) {
                this.toggleEmit(e.currentTarget)
                //turning off  dynamic flow on select click
                globalStore.store.dynamicDomFlow = false;
            },

            toggleEmit(el) {
                this.$emit('toggle-button', el);
                this.$nextTick(() => {
                    if(this.toggleCompleted) {
                        this.onSelect();
                    }
                })
            },

            toggleSelectButton() {
               this.toggleEmit(this.$refs.selectButton)
               //turning on dynamic flow
               globalStore.store.dynamicDomFlow = true;
               //toggleBtn function turns off  dynamic flow on select click
            },

            async getScreenshot(){
                this.$emit('toggle-extension');
                globalStore.store.screenshot = await this.onGetScreenshot();
                this.$emit('toggle-extension');
            },
        }
    }
</script>