<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-report-bug" id="ui-br-ext-report-bug" ref="divToResize">
            <div class="ui-br-ext-drop-title">Report bug</div>
            <div class="ui-br-ext-drop-body">
                <ul>
                    <li>
                        <span>Project:</span>
                        <span id="ui-br-ext-project-name">No project choosen</span>
                    </li>
                </ul>
                <div class="ui-br-ext-form-container ui-br-ext-textarea">
                    <label for="ui-br-ext-description">Description</label>
                    <textarea name="ui-br-ext-description" v-model="form.description" rows="2" data-gramm="false"></textarea>
                </div>
                <div class="ui-br-ext-form-container ui-br-ext-textarea">
                    <label for="ui-br-ext-act-results">Actual results</label>
                    <textarea name="ui-br-ext-act-results" v-model="form.actualResults" rows="3" data-gramm="false"></textarea>
                </div>
                <div class="ui-br-ext-form-container ui-br-ext-textarea">
                    <label for="ui-br-ext-exp-results">Expected results</label>
                    <textarea name="ui-br-ext-exp-results" v-model="form.expectedResults" rows="3" data-gramm="false"></textarea>
                </div>
                <div class="ui-br-ext-form-container ui-br-ext-textarea">
                    <label for="ui-br-ext-rep-steps">Steps to reproduce</label>
                    <textarea name="ui-br-ext-rep-steps" v-model="form.stepsToReproduce" rows="3" data-gramm="false"></textarea>
                </div>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-checkbox">
                <input type="checkbox" name="jira" v-model="form.saveJira">
                <label for="ui-br-ext-save-to-jira">Create Jira ticket on save</label>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-checkbox">
                <input type="checkbox" name="pdf" v-model="form.savePdf">
                <label for="ui-br-ext-save-to-pdf">Save as PDF</label>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-checkbox">
                <input type="checkbox" name="screenshot" v-model="form.saveScreenshot">
                <label for="ui-br-ext-save-to-screenshot">Attach screenshot</label>
                <span class="ui-br-ext-disclaimer">Make sure to remove personal identity information</span>
            </div>
            <button class="ui-br-ext-btn" id="ui-br-ext-save-report" @click="saveReport" data-listener="off">
                <span>Save</span> 
            </button>
            <div class="ui-br-ext-box-resize" id="ui-br-comment-boxResize" @mousedown="onMouseDown">
                <svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" focusable="false"
                    role="img" width="128" height="128" fill="currentColor">
                    <path d="M33,11H3a1,1,0,0,0,0,2H33a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-1" />
                    <path d="M28,17H8a1,1,0,0,0,0,2H28a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-2" />
                    <path d="M23,23H13a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"
                        class="ui-br-ext-clr-i-outline clr-i-outline-path-3" /></svg>
            </div>
            <a href="" ref="downloadImageFull" style="display: none !important;"></a>
        </div>
</template>

<script>

    import screenshot from '../../shared/screenshot';
    import extensionMove from '../../shared/extension-move';
    import { globalStore } from './../../main';

    export default {
        name: 'ReportBugDrop',
        
        created() { 
            this.onGetScreenshot = screenshot.getScreenshot;
            this.mouseMove = extensionMove.onMouseDown;
        },

        mounted: function () {
            window.reportBugComponent = this;
        },

        data() {
            return {
                next: false,
                form: {
                    description: '',
                    actualResults: '',
                    expectedResults: '',
                    stepsToReproduce: '',
                    saveJira: false,
                    savePdf: false,
                    saveScreenshot: false,
                    xPath: '',
                },
                positions: {
                    clientX: undefined,
                    clientY: undefined,
                    resizeX: 0,
                    resizeY: 0,
                    height: undefined,
                    width: undefined
                }
            }
        },

        methods: {

            async saveReport(){
                if(this.form.saveScreenshot) {
                    if(!globalStore.store.dynamicDomFlow) await this.getScreenshot();
                }

                if(this.form.savePdf){
                     console.log('save pdf');
                }

                if(this.form.saveScreenshot && !this.form.savePdf){
                    this.screenshotLink(globalStore.store.screenshot, 'filename');
                }

                if(this.form.saveJira){
                    console.log('save jira')
                }
            },

            async getScreenshot(){
                this.$emit('toggle-extension');
                globalStore.store.screenshot = await this.onGetScreenshot();
                this.$emit('toggle-extension');
            },

            screenshotLink(dataUrl, filename) {
                let dlLink = this.$refs.downloadImageFull;
                let MIME_TYPE = "image/png";
                dlLink.download = filename;
                dlLink.href = dataUrl;
                dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
                dlLink.click();
            },

            onMouseDown() {
                this.mouseMove()
            }
        }
    }
</script>