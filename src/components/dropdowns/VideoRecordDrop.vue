<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-video" id="ui-br-ext-video">

        <div class="ui-br-ext-drop-title">Screen Capture</div>

        <div class="ui-br-ext-form-container ui-br-ext-checkbox">
            <input type="checkbox" name="jira" v-model="upload" id="ui-br-ext-upload-video">
            <label for="ui-br-ext-upload-video">Upload</label>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-checkbox">
            <input type="checkbox" name="pdf" v-model="download" id="ui-br-ext-download-video">
            <label for="ui-br-ext-download-video">Download</label>
        </div>
        <div class="ui-br-ext-btn-group">
            <button class="ui-br-ext-btn" id="ui-br-ext-save-report" @click="preview" data-listener="off">
                <span class="ui-br-ext-spinner"></span>
                <span>Preview</span> 
            </button>
            <button class="ui-br-ext-btn" id="ui-br-ext-save-report" @click="saveVideo" data-listener="off">
                <span>Save</span> 
            </button>
            <button class="ui-br-ext-btn-danger" @click="cancelRecord()" data-listener="off">
                <span>Cancel</span> 
            </button>
        </div>

        <a href="" ref="downloadVideo" style="display: none !important;"></a>
    </div>
</template>

<script>
    import video from '../../common/videorecorder';   
    import eventBus from '../../eventBus';

    export default {
        name: 'VideoRecordDrop',

        components: {
        },
        
        created() { 
            
        },

        mounted() {
            
        },

        data() {
            return {
                upload: false,
                download: false
            }
        },

        methods: {

            startVideo(){
                console.log('start')
            },

            stopRecord(){
                console.log('stop')
            },

            saveVideo(){
               console.log('save'); 
            },
            
            preview(){
                console.log('preview'); 
                eventBus.$emit('preview')
            },

            cancelRecord(){
                eventBus.$emit('toggle-video-drop', {drop: false, videoMode: false})
            },

            
        }
    }
</script>

<style>

    .ui-br-ext-operator {
        display: flex;
        align-items: center;
    }
    .ui-br-ext-video-recorder {
        display: flex;
        width: 100%;
        align-items: center;
    }

    .ui-bt-ext-video-timer {
        display: flex;
        align-items: center;
        width: 100%;
        border: 1px solid #d7d7d7;
        height: 10px;
        border-radius: 6px;
        margin: 0 10px;  
    }
</style >