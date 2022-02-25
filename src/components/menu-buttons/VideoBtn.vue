<template>
    <span class="ui-br-ext-operator ui-br-ext-alwaysOn" data-title="Screen Record" @click="toggleBtn" id="ui-br-ext-video-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ui-br-ext-feather feather-video"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
    </span>
</template>

<script>

    //import operators from '../../common/operators';

    export default {
        name: 'VideoBtn',
        
        props: ['toggleCompleted'],
        
        created() { 
            //this.onSelect = operators.onSelect;
        },

        data() {
            return {
                next: false
            }
        },

        methods: {

            toggleBtn(e) {
                this.$emit('toggle-button', e.currentTarget);
                this.$emit('start-record');
                this.$nextTick(() => {
                    console.log(this.toggleCompleted)
                    if(this.toggleCompleted) {
                        console.log(this.toggleCompleted)
                    }
                })
            },
        }
    }
</script>