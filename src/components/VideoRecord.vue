<template>
    <div class="ui-br-ext-video-recorder">
        <StopBtn @stop-record="stopRecord" @start-record="startRecord" /> 
        <div class="ui-bt-ext-video-timer">
            <div :style="{width: width+'%'}"></div >
        </div >
        <div class="preview" v-if="onPreview">
            <div class="video-box">
                <div class="close" @click="onPreview = false">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f7f7f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </div>
                <video controls>
                    <source src="http://localhost:8080/assets/video.webm" >
                </video>
            </div>
        </div>

    </div>
</template>

<script>

    import StopBtn from './menu-buttons/StopRecordBtn';
    import video from '../common/videorecorder';
    import eventBus from '../eventBus';

    export default {
        name: 'VideoRecord',

        components: {
            StopBtn,
        },

        created() { 
            this.start = video.startRecord;
            this.stop = video.stopRecord;
            this.start = Date.now();
        },

        mounted (){
            this.timer = setInterval(this.timerBody, 600);
            eventBus.$on('preview', this.preview)
        },

        data() {
            return {
                time: 0,
                timer: undefined,
                width: 1,
                onPreview: false
            }
        },

        methods: {

            stopRecord(){
                clearInterval(this.timer)
                this.$emit('toggle-video-drop', true);
            },

            startRecord(){
                this.$emit('toggle-video-drop', false);
                this.time = 0;
                this.width = 0;
                this.timer = setInterval(this.timerBody, 600);
            },

            timerBody(){
                this.width++;
                this.time++;
                if (this.time == 100) clearInterval(this.timer)
            },

            preview(){
                this.onPreview = true
            }

        }
    }

</script>

<style>
    .ui-br-ext-video-recorder {
        display: flex;
        width: 100%;
        align-items: center;
    }

    .ui-bt-ext-video-timer div {
        background: #e04414;
        height: 100%;
        border-radius: 6px;
    }

    .preview {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #00000090;
        z-index: 2147483647;
        z-index: 2147483647;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .preview .video-box {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .preview .video-box .close {
        position: absolute;
        top: -30px;
        right: 50%;
        transform: translateY(-50%);
        width: 30px;
        height: 30px;
        background: #00000080;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .preview .video-box video {
        width: 90%;
        height: auto;
    }
</style >
