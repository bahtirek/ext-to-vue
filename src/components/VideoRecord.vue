<template>
    <div class="ui-br-ext-video-recorder">
        <StopBtn @stop-record="onStopRecord" @start-record="onStartRecord" /> 
        <div class="ui-br-ext-video-timer">
            <div :style="{width: width+'%'}"></div >
        </div >
        <span class="ui-br-ext-message">{{error}}</span>
        <div class="ui-br-ext-preview" v-show="onPreview">
            <div class="ui-br-ext-video-box">
                <div class="ui-br-ext-close" @click="stopPreview">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f7f7f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </div>
                <video ref="playVideoCapture" :src="video" controls>
                </video>
            </div>
        </div>
    </div>
</template>

<script>

    import StopBtn from './menu-buttons/StopRecordBtn';
    ///import video from '../common/videorecorder';
    import eventBus from '../eventBus';

    export default {
        name: 'VideoRecord',

        components: {
            StopBtn,
        },

        created() { 
            //this.start = video.startRecord;
            //this.stop = video.stopRecord;
            //this.start = Date.now();
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
                video: '',
                error: '',
                startTime: undefined
            }
        },

        methods: {

            async startRecord(){  
                this.recordedChunks = [];   
                try {
                    const displayStream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: true});
                    const voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                    this.startTime = Math.round(Date.now() / 1000);
                    chrome.runtime.sendMessage({todo: "setAlarm"});
                    let tracks = [...displayStream.getTracks(), ...voiceStream.getAudioTracks()]
                    const stream = new MediaStream(tracks);
                    this.mediaRecorder = this.createRecorder(stream);
                } catch (error) {
                    console.log(error.message);
                    chrome.runtime.sendMessage({todo: "clearAlarm"});
                    this.error = error.message;
                    eventBus.$emit('permission-denied');
                    this.time = 0;
                    this.width = 0;
                }      
            },

            stopRecord(){
                this.mediaRecorder.stop();
            },

            createRecorder(stream) {
                const options = {mimeType: 'video/webm;codecs=h264'};
                const mediaRecorder = new MediaRecorder(stream, options);

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

            saveFile(){
                const blob = new Blob(this.recordedChunks, {
                    type: 'video/mp4'
                });
                let downloadLink = document.getElementById('uiExtBrDownloadVideo');
                downloadLink.download = `reportbug.mp4`;
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.click();
                URL.revokeObjectURL(blob); // clear from memory
            },

            onStopRecord(){
                clearInterval(this.timer);
                chrome.runtime.sendMessage({todo: "clearAlarm"});
                this.startTime = 0;
                this.$emit('toggle-video-drop', true);
                if(this.mediaRecorder) this.mediaRecorder.stop();
            },

            onStartRecord(){
                this.error = '';
                this.time = 0;
                this.width = 0;
                this.$emit('toggle-video-drop', false);
                this.startRecord();
            },

            timerBody(){
                this.width++;
                this.time = Math.round(Date.now() / 1000) - this.startTime;
                if (this.time == 100) {
                    this.startTime = 0;
                    chrome.runtime.sendMessage({todo: "clearAlarm"});
                    eventBus.$emit('click-stop')
                }
            },

            preview(){
                this.onPreview = true
                
                let videoEl = this.$refs.playVideoCapture;

                const blob = new Blob(this.recordedChunks, {
                    type: 'video/webm'
                });
                const newObjectUrl = URL.createObjectURL( blob );

                // URLs created by `URL.createObjectURL` always use the `blob:` URI scheme: https://w3c.github.io/FileAPI/#dfn-createObjectURL
                let oldObjectUrl;
                if (videoEl && videoEl.currentSrc) oldObjectUrl = videoEl.currentSrc;
                
                if( oldObjectUrl && oldObjectUrl.startsWith('blob:') ) {
                    // It is very important to revoke the previous ObjectURL to prevent memory leaks. Un-set the `src` first.
                    // See https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL

                    videoEl.src = ''; // <-- Un-set the src property *before* revoking the object URL.
                    URL.revokeObjectURL( oldObjectUrl );
                }

                videoEl.src = newObjectUrl;
            },

            stopPreview(){
                let videoEl = this.$refs.playVideoCapture;
                videoEl.pause();
                this.onPreview = false;
            }
        }
    }

</script>


