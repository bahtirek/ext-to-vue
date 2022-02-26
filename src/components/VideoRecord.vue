<template>
    <div class="ui-br-ext-video-recorder">
        <StopBtn @stop-record="stopRecord"/> 
        <div class="ui-bt-ext-video-timer">
            <div :style="{width: width+'%'}"></div >
        </div >
    </div>
</template>

<script>

    import StopBtn from './menu-buttons/StopRecordBtn';
    import video from '../common/videorecorder';

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
            this.start = Date.now();
            console.log(this.start);
            this.timer = setInterval(() => {
                this.width++
            }, 600);
        },

        data() {
            return {
                timer: undefined,
                start: undefined,
                width: 1
            }
        },

        methods: {

            stopRecord(){
                console.log(this.start);
                clearInterval(this.timer)
                this.$emit('toggle-video-drop', true);
            },

            startRecord(){
                this.$emit('toggle-video-drop', false)
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
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
}
</style >
