<template>

    <div class="ui-br-ext-box-resize" id="ui-br-comment-boxResize" @mousedown="onMouseDown" @touchstart="onTouchStart">
        <svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" focusable="false"
            role="img" width="128" height="128" fill="currentColor">
            <path d="M33,11H3a1,1,0,0,0,0,2H33a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-1" />
            <path d="M28,17H8a1,1,0,0,0,0,2H28a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-2" />
            <path d="M23,23H13a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"
                class="ui-br-ext-clr-i-outline clr-i-outline-path-3" /></svg>
    </div>

</template>

<script>

    import extensionMove from '../../common/extension-resize';

    export default {
        name: 'Resize',

        props: [
            'elementId'
        ],

        data() {
            return {
                element: undefined
            }
        },

        created() { 
            this.mouseMove = extensionMove.onMouseDown;
            this.touchMove = extensionMove.onTouchStart;
        },

        methods: {
            onMouseDown(event) {
                this.mouseMove(event, this.elementId);
            },

            onTouchStart(event){   
                if(event.path[1]['id'] == 'ui-br-comment-boxResize') {
                    this.touchMove(event)
                }            
            },
        }
    }
</script>