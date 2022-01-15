<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-review" id="ui-br-ext-review" ref="divToResize">
        <div class="ui-br-ext-drop-title">Review</div>
        <div class="ui-br-ext-drop-body">
            <ul class="ui-br-ext-info-list">
                <li v-if="currentModule && currentModule.label">
                    <span><strong> Module label: </strong></span>
                    <span v-if="currentModule"> {{currentModule.label || 'No module chosen'}}</span>
                </li>
            </ul >
            <div class="ui-br-ext-review-card" v-for="(report, index) in reports" :key="index">
                <ul class="ui-br-ext-info-list" >
                    <li v-if="report.user && (report.user.firstname || report.user.lastname)">
                        <span><strong>User: </strong></span>
                        <span> {{report.user.firstname}} {{report.user.lastname}}</span>
                    </li >
                    <li v-if="report.user && report.user.email">
                        <span><strong>Email: </strong></span>
                        <span> {{report.user.email}}</span>
                    </li >
                </ul >
                <div class="ui-br-ext-review-box ui-br-ext-ellipsis" v-if="report.content.description" @click="showDetails(index)">
                    <div class="ui-br-ext-review-title">Description:</div>
                    <div class="ui-br-ext-review-text">{{report.content.description}}</div>
                </div>
                <span class="ui-br-ext-btn-lnk" v-if="report.xPath" @click="showElement(index)">Find Element</span>
                <span class="ui-br-ext-btn-lnk" v-if="report.screenshot" @click="showImage(report.screenshot)">Screenshot</span>
            </div>
            
        </div>
        <div class="ui-br-ext-box-resize" id="ui-br-review-reviewResize" @mousedown="onMouseDown" @touchstart="onTouchStart">
            <svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" focusable="false"
                role="img" width="128" height="128" fill="currentColor">
                <path d="M33,11H3a1,1,0,0,0,0,2H33a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-1" />
                <path d="M28,17H8a1,1,0,0,0,0,2H28a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-2" />
                <path d="M23,23H13a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-3" /></svg>
        </div>
    </div>
</template>


<script>

    import { globalStore } from './../../main';
    import eventBus from './../../eventBus';
    import extensionMove from '../../shared/extension-resize';

    export default {
        name: 'ReviewDrop',

        created() { 
            this.mouseMove = extensionMove.onMouseDown;           
        },

        mounted: function () {
            this.reports = globalStore.store.reports;
            this.currentModule = globalStore?.store.currentModule;
            this.showElements();

            eventBus.$on('account-loaded', (val) => {
                this.currentModule = globalStore.store.currentModule;
            });

            eventBus.$on('report-loaded', (val) => {
                this.reports = globalStore.store.reports;
            });
        },

        data() {
            return {
                ifModule: false,
                ifAccount: false,
                ifUser: false,
                currentModule: {},
                account: {},
                reports: [],
                positions: {
                    clientX: undefined,
                    clientY: undefined,
                    resizeX: 0,
                    resizeY: 0,
                    height: undefined,
                    width: undefined
                },
            }
        },

        methods: {

            showElement(index){
                
                this.deselectElements();
                this.selectElement(index);              
                this.reports[index]['element'].scrollIntoView();

            },

            showElements(){

                for (let index = 0; index < this.reports.length; index++) {
                    this.selectElement(index);                   
                }

            },

            selectElement(index){
                let report = this.reports[index];
                let element = document.evaluate(report.xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
                if(element){
                    report.element = element;
                    element.classList.add('ui-br-ext-outlined-element');
                    element.style.cssText = element.style.cssText + "outline: red dashed 3px !important;";
                } else {
                    report.element = false;
                    // move report to the bottom of reports array
                    this.reports.splice(index, 1);
                    this.reports.push(report);
                    eventBus.$on('report-loaded');
                }
            },

            deselectElements() {
                document.querySelectorAll('.ui-br-ext-outlined-element').forEach(element => {
                    element.classList.remove('ui-br-ext-outlined-element');
                    element.style.cssText = element.style.cssText.replace('outline: red dashed 3px !important;', '');
                });
            },

            showImage(screenshot) {
                if(screenshot) {
                    let image = new Image();
                    image.src = screenshot;

                    let w = window.open("");
                    w.document.write(image.outerHTML);
                }
            },

            showDetails(index) {
                this.$emit('show-detailsDrop', index);
                eventBus.$emit('toggle-drop', 'ui-br-ext-reportdetails-button');
            },

            onMouseDown(event) {
                this.mouseMove(event)
            },

            onTouchStart(event){   
                if(event.path[1]['id'] == 'ui-br-comment-reviewResize') {
                    this.touchMove(event)
                }            
            },
        }
    }
</script>