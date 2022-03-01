<template>
    <div class="ui-br-ext-video-recorder">
        <StopBtn @stop-record="onStopRecord" @start-record="onStartRecord" /> 
        <div class="ui-br-ext-video-timer">
            <div :style="{width: width+'%'}"></div >
        </div >
        <div class="ui-br-ext-preview" v-show="onPreview">
            <div class="ui-br-ext-video-box">
                <div class="ui-br-ext-close" @click="onPreview = false">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f7f7f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </div>
                <video ref="playVideoCapture" :src="video" controls>
                </video>
            </div>
        </div>
        <a href="" ref="downloadVideoCapture" style="display: none !important;"></a>
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
            this.startRecord();
            eventBus.$on('preview', this.preview);
            eventBus.$on('download', this.saveFile);
            eventBus.$on('upload', this.upload);
        },

        data() {
            return {
                time: 0,
                timer: undefined,
                width: 1,
                onPreview: false,
                mediaRecorder: undefined,
                recordedChunks: [],
                mimeType:'video/webm',
                video: ''
            }
        },

        methods: {

            async startRecord(){  
                this.recordedChunks = [];         
                const displayStream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: true});
                const voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                let tracks = [...displayStream.getTracks(), ...voiceStream.getAudioTracks()]
                const stream = new MediaStream(tracks);
                this.mediaRecorder = this.createRecorder(stream);
            },

            stopRecord(){
                this.mediaRecorder.stop();
            },

            createRecorder(stream) {
                
                const mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        // the stream data is stored in this array 
                        this.recordedChunks.push(e.data);
                    }  
                };

                mediaRecorder.onstart = ()=>{
                    this.timer = setInterval(this.timerBody, 600);
                },

                mediaRecorder.onstop = () => {
                    stream.getTracks().forEach(track => track.stop())//removes stop sharing dialog box
                };
                
                mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
                return mediaRecorder;
            },

            saveFile(recordedChunks){
                const blob = new Blob(this.recordedChunks, {
                    type: 'video/webm'
                });
                let downloadLink = this.$refs.downloadVideoCapture;
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = `reportbug.webm`;
                downloadLink.click();
                URL.revokeObjectURL(blob); // clear from memory
            },

            onStopRecord(){
                clearInterval(this.timer)
                this.$emit('toggle-video-drop', true);
                this.mediaRecorder.stop();
            },

            onStartRecord(){
                this.time = 0;
                this.width = 0;
                this.$emit('toggle-video-drop', false);
                this.startRecord();
            },

            onSave(action) {
                console.log(action);
                if(this.action.upload) this.upload();
                if(this.action.download) this.saveFile();
            },

            timerBody(){
                this.width++;
                this.time++;
                if (this.time == 100) clearInterval(this.timer)
            },

            preview(){
                this.onPreview = true
                
                let videoEl = this.$refs.playVideoCapture;

                const blob = new Blob(this.recordedChunks, {
                    type: 'video/webm'
                });
                const newObjectUrl = URL.createObjectURL( blob );

                // URLs created by `URL.createObjectURL` always use the `blob:` URI scheme: https://w3c.github.io/FileAPI/#dfn-createObjectURL
                const oldObjectUrl = videoEl.currentSrc;
                if( oldObjectUrl && oldObjectUrl.startsWith('blob:') ) {
                    // It is very important to revoke the previous ObjectURL to prevent memory leaks. Un-set the `src` first.
                    // See https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL

                    videoEl.src = ''; // <-- Un-set the src property *before* revoking the object URL.
                    URL.revokeObjectURL( oldObjectUrl );
                }

                videoEl.src = newObjectUrl;
            },
        }
    }

</script>


