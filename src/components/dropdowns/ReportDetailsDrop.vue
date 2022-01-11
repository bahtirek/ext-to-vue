<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-review" id="ui-br-ext-report-details" ref="divToResize">
        <div class="ui-br-ext-drop-title">Repor details</div>
        <div class="ui-br-ext-drop-body">
            <ul class="ui-br-ext-info-list">
                <li v-if="currentProject && currentProject.label">
                    <span>Project label: </span>
                    <span v-if="currentProject"> <strong> {{currentProject.label || 'No project chosen'}}</strong></span>
                </li >
            </ul >
            <!-- <div class="ui-br-ext-review-box">
                <div class="ui-br-ext-review-title">Description</div>
                <div class="ui-br-ext-review-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem voluptas iste similique? Dolores consequuntur necessitatibus exercitationem aperiam ea dolorum deleniti nobis delectus eveniet qui. Sint perspiciatis tenetur asperiores cum distinctio!</div>
            </div> -->
            <div v-if="report" style="padding: 0 10px">
                <div v-if="report.user.firstname || report.user.lastname">Reporter: 
                    <span class="ui-br-ext-review-title" v-if="report.user.firstname">{{report.user.firstname}} </span>
                    <span class="ui-br-ext-review-text" v-if="report.user.lastname"> {{report.user.lastname}}</span>
                </div>
                <div class="ui-br-ext-review-box ellipsis" v-if="report.content.description">
                    <div class="ui-br-ext-review-title">Description:</div>
                    <div class="ui-br-ext-review-text">{{report.content.description}}</div>
                </div>
                <div class="ui-br-ext-review-box" v-if="report.content.stepsToReproduce">
                    <div class="ui-br-ext-review-title">Description:</div>
                    <div class="ui-br-ext-review-text">{{report.content.stepsToReproduce}}</div>
                </div>
                <div class="ui-br-ext-review-box" v-if="report.content.actualResults">
                    <div class="ui-br-ext-review-title">Description:</div>
                    <div class="ui-br-ext-review-text">{{report.content.actualResults}}</div>
                </div>
                <div class="ui-br-ext-review-box" v-if="report.content.expectedResults">
                    <div class="ui-br-ext-review-title">Description:</div>
                    <div class="ui-br-ext-review-text">{{report.content.expectedResults}}</div>
                </div>
                <button v-if="report.screenshot" @click="showImage(report.screenshot)">Screenshot</button>
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
    import eventBus from './../../eventBus'
    import extensionMove from '../../shared/extension-resize';

    export default {
        name: 'ReportDetailsDrop',

        created() { 
            this.mouseMove = extensionMove.onMouseDown;           
        },
        props: [
            'reportIndex'
        ],

        mounted: function () {
            this.reports = globalStore.store.reports;
            this.currentProject = globalStore?.store.currentProject;
            this.report = globalStore.store.reports[this.reportIndex];           
        },

        data() {
            return {
                ifProject: false,
                ifAccount: false,
                ifUser: false,
                currentProject: {},
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

            showImage(screenshot) {
                if(screenshot) {
                    let image = new Image();
                    image.src = screenshot;

                    let w = window.open("");
                    w.document.write(image.outerHTML);
                }
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