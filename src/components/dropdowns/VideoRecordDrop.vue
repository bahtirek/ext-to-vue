<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-video" id="ui-br-ext-video">

        <div class="ui-br-ext-drop-title">Screen Capture</div>

        <!-- <div class="ui-br-ext-form-container ui-br-ext-checkbox">
            <input type="checkbox" name="jira" v-model="upload" :disabled="canUpload" id="ui-br-ext-upload-video">
            <label for="ui-br-ext-upload-video">Upload</label>
        </div>
        <div class="ui-br-ext-form-container ui-br-ext-checkbox">
            <input type="checkbox" name="pdf" v-model="download" id="ui-br-ext-download-video">
            <label for="ui-br-ext-download-video">Download</label>
        </div> -->
        <div class="ui-br-ext-btn-group">
            <!-- <button class="ui-br-ext-btn" id="ui-br-ext-save-report" @click="preview" data-listener="off">
                <span class="ui-br-ext-spinner"></span>
                <span>Preview</span> 
            </button> -->
            <button class="ui-br-ext-btn" id="ui-br-ext-save-report" @click="saveVideo" data-listener="off">
                <span>Save</span> 
            </button>
            <button class="ui-br-ext-btn-danger" @click="cancelRecord()" data-listener="off">
                <span>Cancel</span> 
            </button>
        </div>

        <a href="" id="uiExtBrDownloadVideo" style="display: none !important;"></a>
    </div>
</template>

<script>  
    import eventBus from '../../eventBus';
    import { globalStore } from './../../main';

    export default {
        name: 'VideoRecordDrop',

        components: {
        },
        
        computed: {
            
        },

        mounted: function () {
            this.account = globalStore.store.account;
            this.module = globalStore.store.currentModule;
            this.project = globalStore.store.project;
            this.canUpload = this.isUploadable();
        },

        data() {
            return {
                upload: false,
                download: false,
                canUpload: false
            }
        },

        methods: {

            isUploadable() {
                if(this.project && this.project.id && this.module && this.module.moduleId) return true;
            },

            startVideo(){
                console.log('start')
            },

            stopRecord(){
                console.log('stop')
            },

            saveVideo(){ 
               /* if(this.upload) eventBus.$emit('upload')
               if(this.download) eventBus.$emit('download') */
               eventBus.$emit('download')
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