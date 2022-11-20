<template>
    <div class="ui-br-ext-header" id="ui-br-ext-header"  style="outline: none !important;" @mousedown="onMouseDown" @touchstart="onTouchStart">
        <div class="ui-br-ext-menu-container ui-br-ext-container ui-br-ext-alwaysOn">
            <template v-if="!videoMode">
                <SelectBtn @toggle-button="toggleButton" :toggleCompleted="toggleCompleted"  @toggle-extension="$emit('toggle-extension')" />
                <ReportBugBtn @toggle-button="toggleButton" :toggleCompleted="toggleCompleted" />
                <ReviewBtn @toggle-button="toggleButton" :toggleCompleted="toggleCompleted" />
                <VideoBtn @toggle-button="toggleButton" :toggleCompleted="toggleCompleted" />
                <SettingsBtn @toggle-button="toggleButton" :toggleCompleted="toggleCompleted" />
                <CloseBtn @toggle-button="toggleButton" />  
            </template>
            <template v-if="videoMode">
                <VideoRecord @toggle-video-drop="toggleVideoDrop" />
            </template>
            
        </div>
    </div>
</template>

<script>

    import SelectBtn from './menu-buttons/SelectBtn';
    import ReportBugBtn from './menu-buttons/ReportBugBtn';
    import ReviewBtn from './menu-buttons/ReviewBtn';
    import VideoBtn from './menu-buttons/VideoBtn';
    import SettingsBtn from './menu-buttons/SettingsBtn';
    import CloseBtn from './menu-buttons/CloseBtn';
    import VideoRecord from './VideoRecord';
    import operators from '../common/operators';
    import select from '../common/select';
    import eventBus from '../eventBus';

    export default {
        name: 'MainMenu',

        components: {
            SelectBtn,
            ReportBugBtn,
            ReviewBtn,
            VideoBtn,
            SettingsBtn,
            CloseBtn,
            VideoRecord,
        },

        created() { 
            this.activateOperator = operators.activateOperator;
            this.onDeselect = select.onDeselect;
            this.removeClickFromBodyOnReport = operators.removeClickFromBodyOnReport;
        },

        mounted() {
            eventBus.$on('toggle-video-drop', (data) => {
                this.toggleVideoDrop(data.drop)
                this.videoMode = data.videoMode
            })
            eventBus.$on('toggle-bug-drop', (data) => {
                this.collapseBugDrop(data.state)
                if(data.toggleReportDetails) {
                    /* open new bug in bug details */
                    this.toggleBugDetail(data.toggleReportDetails)
                }
            })
        },

        data() {
            return {
                toggleCompleted: false,
                positions: {
                    clientX: undefined,
                    clientY: undefined,
                    movementX: 0,
                    movementY: 0
                },
                videoMode: false
            }
        },

        methods: {
            toggleButton(el) {
                document.body.classList.remove('ui-br-ext-freeze');
                if (el.id == 'ui-br-ext-close-button') {
                    this.onDeselect();
                    window.destroyeUibrextInstance()
                } else {
                    this.toggleCompleted = this.activateOperator(el);//Activate button
                    this.toggleDrops(el.id, this.toggleCompleted); //Expand dropdown if exist
                    if(el.id == 'ui-br-ext-report-bug-button') {
                        this.removeClickFromBodyOnReport();
                        document.body.classList.add('ui-br-ext-freeze');
                    }
                }               
            },  
            
            toggleDrops(id, state){
                id = id.replace('ui-br-ext-', "").replace(/-/g, "").replace('button', '');
                if(id == 'video') state = false;// don't expand video drop on video btn click
                this.$emit('toggle-drop', {id: id, state: state});
                if (id == 'video') this.videoMode = true;
            },

            onMouseDown: function (event) {
                event.preventDefault();
                // get the mouse cursor position at startup:
                this.positions.clientX = event.clientX
                this.positions.clientY = event.clientY
                document.onmousemove = this.elementDrag
                document.onmouseup = this.closeDragElement
            },

            elementDrag: function (event) {
                event.preventDefault();
                const draggableContainer = document.getElementById('ui-br-ext-extension')
                this.positions.movementX = this.positions.clientX - event.clientX
                this.positions.movementY = this.positions.clientY - event.clientY
                this.positions.clientX = event.clientX
                this.positions.clientY = event.clientY
                // set the element's new position:
                if (event.clientY > 0 && event.clientY < window.innerHeight) {
                    draggableContainer.style.top = (draggableContainer.offsetTop - this.positions.movementY) + 'px'
                }
                if (event.clientX > 0 && event.clientX < window.innerWidth){
                    draggableContainer.style.left = (draggableContainer.offsetLeft - this.positions.movementX) + 'px'
                }
            },

            closeDragElement () {
                document.onmouseup = null
                document.onmousemove = null
                document.ontouchend = null
                document.ontouchmove = null
            },

            onTouchStart(event){   
                if(event.target.id == 'ui-br-ext-header') {
                    event.preventDefault();
                    event.stopPropagation();
                    const touchevent = event.touches[0];
                    this.positions.clientX = touchevent.clientX
                    this.positions.clientY = touchevent.clientY
                    document.ontouchmove = this.onTouchMove
                    document.ontouchend = this.closeDragElement
                }            
            },

            onTouchMove(event) {
                event.stopPropagation();
                let touchevent = event.touches[0];
                const draggableContainer = document.getElementById('ui-br-ext-extension')
                this.positions.movementX = this.positions.clientX - touchevent.clientX
                this.positions.movementY = this.positions.clientY - touchevent.clientY
                this.positions.clientX = touchevent.clientX
                this.positions.clientY = touchevent.clientY
                // set the element's new position:
                if (touchevent.clientY > 0 && touchevent.clientY < window.innerHeight) {
                    draggableContainer.style.top = (draggableContainer.offsetTop - this.positions.movementY) + 'px'
                }
                if (touchevent.clientX > 0 && touchevent.clientX < window.innerWidth){
                    draggableContainer.style.left = (draggableContainer.offsetLeft - this.positions.movementX) + 'px'
                }
            },

            toggleVideoDrop(val){
                this.$emit('toggle-drop', {id: 'video', state: val})
            },

            toggleBugDetail(bugId) {
                this.$emit('toggle-drop', {id: 'review', state: true});
                eventBus.$emit('show-details', bugId)
            },

            collapseBugDrop(data){
                this.$emit('toggle-drop', {id: 'report-bug', state: data})
                document.body.classList.remove('ui-br-ext-freeze');
                const el =  document.getElementById('ui-br-ext-report-bug-button');
                const els = document.querySelectorAll('.ui-br-ext-outlined-element')
 
                el.classList.add('ui-br-ext-report-bug-inactive');
                els.forEach(element => {
                    element.classList.remove('ui-br-ext-outlined-element');
                    element.classList.remove('ui-br-ext-selected-element-outline-red');
                    element.classList.remove('ui-br-ext-selected-element-outline-green');
                    element.removeAttribute('data-ext-index');
                });
            
            }
        }
    }

</script>