<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-report-bug" id="ui-br-ext-report-bug" ref="divToResize">
        <div class="ui-br-ext-drop-title">Report bug</div>
        <div class="ui-br-ext-drop-body">
            <ul>
                <li v-if="account && account.registratonKey">
                    <span>Project label: </span>
                    <span id="ui-br-ext-project-name" v-if="currentProject"> <strong> {{currentProject.label || 'No project chosen'}}</strong></span>
                </li >
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
        <div class="ui-br-ext-form-container ui-br-ext-checkbox" v-if="account && account.registratonKey">
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
    import jsPDF from 'jspdf';
    import eventBus from './../../eventBus'

    export default {
        name: 'ReportBugDrop',
        
        created() { 
            this.onGetScreenshot = screenshot.getScreenshot;
            this.mouseMove = extensionMove.onMouseDown;
        },

        mounted: function () {
            window.reportBugComponent = this;
            this.account = globalStore?.store?.account;
            this.currentProject = globalStore?.store.currentProject;

            eventBus.$on('account-loaded', (val) => {
                this.account = globalStore.store.account;
                this.currentProject = globalStore.store.currentProject;
                console.log('reportbug line80', globalStore.store);
            })
        },

        data() {
            return {
                next: false,
                currentProject: {},
                account: {},
                form: {
                    description: '',
                    actualResults: '',
                    expectedResults: '',
                    stepsToReproduce: '',
                    saveJira: false,
                    savePdf: false,
                    saveScreenshot: false,
                    screenshot: '',
                    xPath: '',
                },
                positions: {
                    clientX: undefined,
                    clientY: undefined,
                    resizeX: 0,
                    resizeY: 0,
                    height: undefined,
                    width: undefined
                },
                filename: 'BugReport',
                name: 'test',
            }
        },

        methods: {

            async saveReport(){
                
                if(this.currentProject && this.currentProject.label) this.filename = this.currentProject.label + '_' + this.getDate();

                if(this.form.saveScreenshot) {
                    if(!globalStore.store.dynamicDomFlow) {
                        console.log('not dynamic');
                        await this.getScreenshot();
                    }
                }

                if(this.form.savePdf){
                    this.savePdf()
                }

                if(this.form.saveScreenshot && !this.form.savePdf){
                    this.screenshotLink(globalStore.store.screenshot, this.filename);
                }

                if(this.form.saveJira){
                    console.log('save jira')
                }

                this.form = {
                    description: '',
                    actualResults: '',
                    expectedResults: '',
                    stepsToReproduce: '',
                    saveJira: false,
                    savePdf: false,
                    saveScreenshot: false,
                    screenshot: '',
                    xPath: '',
                }                
            },

            savePdf() {
                let count = 20;
                let doc = new jsPDF('p','mm', 'letter');
                const width = doc.internal.pageSize.getWidth() - 20;
                const ratio = window.innerWidth / window.innerHeight;
                const height = width/ratio;
                const list = ['description', 'actualResults', 'expectedResults', 'stepsToReproduce'];
                const titles = {
                    description: 'Description',
                    actualResults: 'Actual results',
                    expectedResults: 'Expected results',
                    stepsToReproduce: 'Steps to reproduce'
                }
                for (const item of list) {

                    if (this.form[item].length > 0) {
                        // Title
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(14);
                        doc.text(titles[item], 10, count);
                        // Text
                        count = count + 5;//spacing between title and text
                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(12);
                        doc.text(this.form[item], 10, count);
                        count = count + 10;//spacing between descriptions
                    }
                    
                }
                if(this.form.saveScreenshot) {
                    doc.addImage(globalStore.store.screenshot, "PNG", 10, count, width, height);
                }

                doc.save(this.filename + '.pdf'); 
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

            onMouseDown(e) {
                this.mouseMove(e)
            },

            getDate() {
                /* var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();

                return mm + '/' + dd + '/' + yyyy; */
                let date = Date.now().toString();
                return date.slice(-6)
            }
        }
    }
</script>

