<template>
    <div>
        <span class="ui-br-ext-operator ui-br-ext-alwaysOn" data-title="Stop Record" @click="stopRecord" id="ui-br-ext-stop-button" v-if="recording">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e04414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ui-br-ext-feather ui-bt-ext-stop-button feather-stop-circle"><circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6"/></svg>
        </span>
        <span class="ui-br-ext-operator ui-br-ext-alwaysOn" data-title="Start Record" @click="startRecord" id="ui-br-ext-stop-button" v-if="!recording">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ad55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play-circle"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
        </span>
    </div>
</template>

<script>

    import eventBus from '../../eventBus';

    export default {
        name: 'StopBtn',
        
        props: ['toggleCompleted'],
        
        mounted() { 
            eventBus.$on('permission-denied', this.stopRecord)
            eventBus.$on('click-stop', this.stopRecord)
            window.stopRecordButton = this;
        },

        data() {
            return {
                next: false,
                disabled: false,
                recording: true
            }
        },

        methods: {

            stopRecord(){
                this.recording = false;
                this.$emit('stop-record');
            },
            startRecord(){
                this.$emit('start-record');
                this.recording = true;
            }
            
        }
    }
</script>

<style>  
    
</style>