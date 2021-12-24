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
    import jsPDF from 'jspdf';

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
                name: 'test',
                screen: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFcAAABVCAYAAAA8AHhnAAAAAXNSR0IArs4c6QAABZpJREFUeF7tnV1oHFUUx//baloXW6RbBFeoWcQkYqM2CNqPJa2tLxIEwTY+FdqH9EOIbAWJL6kb3IL0yV1I2odQqJBSQh6L1gdbTZqCkCBGYiusDcXmxS6I2Ghi7crszM3OzM6mZ++du7Njzr7tcO655/zuuf9zmZlsIuCPNgIRbZ7ZMRiuxiJguAxXIwGNrj0rt1gsFjXO+b90HYlEKlgyXJ+WmuH6BNLLDcNluBoJaHTNlctwNRLQ6Fq9cicmgGSyMsRdu4DxcfP63bvA0BDQ3++027wZOHYMGBgwr9+4ARw/Dly54rRrawMGB4E9e8zrjTqniwLD9XNBGa7G3aIVrl0KNGpZ4K7tsrRCzv7KAsN1rDvDldkGdatcmeBWyRj1yl0loGTSZLgy1Ihj1OFOTwMHD5rTdXQA588Tpw6xGTFndbhEcQ8xysrQiTkzXJlVZ7gy1IhjGC4RlIxZ4HD/nMfMF2fQO2jdGYvG0br3KDInkojJJNRIY+oGd2EBmJszU49GgeZmwA1WgAkt4CUU8t9jfPQaYj0pJNcvALdulXNOJDyXXr2hebi9Nz+Dy0O9GP6lFft6MkhtB/LXLyLz8SUstu7D0VMpJDc1UimuFMs9zM9cxpneYeRrjF0r3Nx0dSkQCzBypx3dH2axvw1YKuQxeSGD09ebSovy3tbfre/Atr1diI/nMDoHROPWonXGbGOq2wh0Ys7chFV0Nj+AgDiCfPwV7Nz+M0bHCtiIZ9CMGfwgnMQSaD/Qh+yBlodWhzpc42azeMJgPDEwniq4ZcEjoFrgpsesLWhLRwAWC7CSTapzAwr5SVz8JF1aHMdnObanrQrNweoSQDSGJ57cipa5b/CdHe6LbyP74+fmFZGzB2p1uFXEXVShPWl7xdUG9w8k2rvRl92PZqu602PmtQ9OduC3CxmI7142fad2YrHUXKcQF1v78YJLqnrw7B1j++cw5VnRNlmYtT3aCu5+rtEInBUTS5gy8OZGU5dpsmDKRKrTOGc4NfDwibew9quylNBtAGdv+Ajdm6Y8tNVDcxsDrtgrZciXlky97Hlu3tn0OmOuZO2aW0+4I/jV2iWmqjYU3C89u6v7BCHg5n4SDaKseWJblvW0LAsty3o+W1UW3Da1yYIbriiM07i2zjrpBFm57q5c1vrosua9WjRPBqrNyv+GVg2u1QyNBhhPIps7bKalVXONdxLEewbGewjWuwWVDa0MVpxxHYsQjSPx8hvoeupbDFccxZrwWte7eGE2DeMY5X0Uq25T61HMKQvlI2KpEKJxPP/SO/h0231sMBzbcnYfGNRPCw897ckbuM+9ZrNyfig28hGojWS4avxWHK0O9/Zt4Nw5c5ItW4BDh3wLl1KVFBvfAhKOiDmrwyXeIfI9wSAdEnNmuDKLxHBlqBHHMFwiKBkzhitDjTimbnCJnZMYdjjMiDmrN7Rw4AgkSoarEbs63Cr3FjTGHLxrYs7qcIniHjwRHyMg5sxwZZgzXBlqxDEMlwhKxozhylAjjqkbXK/3FogxhtaMmLN6QwstIf2BM1yNjNXhGm85Et7405hD/V0Tc1aHSxT3+hPQOCMxZ4YrswYMV4YacQzDJYKSMWO4MtSIY+oGl/jXhMSww2FGzFm9oYUDRyBRMlyN2BluQ8MlirvGHOrvmpizeuUSJ6o/AY0zEnMmw/3r70XP389dMzmJptfNH1N7sGMHlr52/eCaxhyDck3N+bH162i/n0uBa0/WDjpSKGDt2bN4ZCDt4FGMxfDvkSO433+ydD1y8yYefb8Xa65eddq1tuKfz7J4sHt36bo9uUaa073YDNfHBWW4GneL73CD0r0wzKssC2FIMqgYGa5G8gyX4WokoNE1Vy7D1UhAo2ty5WqMYVW55v8qpXG5GS7D1UhAo2uuXI1w/wNYlgyw0VnguAAAAABJRU5ErkJggg==" id="ui-br-ext-download-image-cropped" style="display: none;" download="cropped_screenshot" data-downloadurl="image/png:cropped_screenshot:data:image/png;base64,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`
            }
        },

        methods: {

            async saveReport(){
                if(this.form.saveScreenshot) {
                    if(!globalStore.store.dynamicDomFlow) await this.getScreenshot();
                }

                if(this.form.savePdf){
                    this.savePdf()
                }

                if(this.form.saveScreenshot && !this.form.savePdf){
                    this.screenshotLink(globalStore.store.screenshot, 'filename');
                }

                if(this.form.saveJira){
                    console.log('save jira')
                }
            },

            savePdf() {
                let pdfName = 'test'; 
                let count = 20;
                var doc = new jsPDF();
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
                        doc.setFontSize(15);
                        doc.text(titles[item], 10, count);
                        // Text
                        count = count + 7;
                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(14);
                        doc.text(this.form[item], 10, count);
                        count = count + 15;
                    }
                    
                }
                if(this.form.saveScreenshot) {
                    doc.addImage(this.screen, "JPEG", 15, count, 180, 180);
                }

                doc.save(pdfName + '.pdf'); 
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

