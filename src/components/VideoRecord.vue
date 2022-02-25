<template>
    <div class="ui-br-ext-video-recorder">
        <StopBtn @stop-record="stopRecord"/> 
        <div class="ui-bt-ext-video-timer">
            <div></div>
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
            /* this.timer = setInterval(() => {
                var delta = Date.now() - this.start; // milliseconds elapsed since start
                console.log(this.start);
                console.log(Math.floor(delta / 1000)); // in seconds
                // alternatively just show wall clock time:
                console.log(new Date().toUTCString());
            }, 1000); */
        },

        data() {
            return {
                time: '00:00:00',
                start: undefined
            }
        },

        methods: {

            stopRecord(){
                console.log(this.start);
                clearInterval(this.timer)
                this.$emit('stop-record')
            },



        }
    }

</script>

<style lang="scss">
.ui-br-ext-video-recorder {
    display: flex;
    width: 100%;
    align-items: center;
}
</style >
