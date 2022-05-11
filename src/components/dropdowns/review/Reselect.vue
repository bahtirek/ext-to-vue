<template>
    <div >  
        <div class="ui-br-ext-close-details" @click="close">Close</div>  
        <div class="ui-br-ext-spacer-3"></div>
        <div  class="ui-br-ext-review-card">
            <ul>
                <li>Reselct element</li>
                <li>Updates new xPath</li>
                <li>Replaces screenshot</li>
            </ul>
            <div class="ui-br-ext-btn-group">
                <button class="ui-br-ext-btn" @click="saveSelection" data-listener="off">
                    <span class="ui-br-ext-spinner" :class="{ active: submitInPorgress }"></span>
                    <span>Save selection</span> 
                </button>
                <button class="ui-br-ext-btn-danger" @click="close" data-listener="off">
                <span class="ui-br-ext-spinner"></span>
                <span>Cancel</span> 
            </button>
            </div>
        </div>
    </div>
</template>

<script>

    import select from '../../../common/select.js';
    import screenshot from '../../../common/screenshot.js';
    import clickBlocker from '../../../common/click-blocker'; 
    import reselectService from '../../../services/reselect.service'; 
    import { globalStore } from '../../../main.js';

    export default {
        name: 'Reselect',

        components: {
        },

        props: [
            'report',
            'account',
        ],

        created() { 
            this.onSelect = select.onSelect;
            this.removeClickBlocker = clickBlocker.removeClickBlocker;
            this.removeClickFromBody = select.removeClickFromBody;
            this.getMouseCoordinates = select.getMouseCoordinates;
            this.getElementXpath = select.getElementXpath;
            this.onGetScreenshot = screenshot.getScreenshot;
            this.patch = reselectService.patchReselect;
        },

        mounted() { 
            this.startSelect()
            console.log(this.report);
        },

        data() {
            return {
                xpath: '',
                screenshot: '',
                submitInPorgress: false
            }
        },

        methods: {

            async saveSelection(){
                this.removeClickFromBody(this.getMouseCoordinates);
                this.submitInPorgress = true;
                if(!globalStore.store.dynamicDomFlow) {
                    await this.getScreenshot();
                } else {
                    this.screenshot = globalStore.store.screenshot;
                }
                const xpath = this.getElementXpath(globalStore.store.selectedElement);
                if(this.screenshot && xpath) {
                    try {
                        const result = await this.patch(this.account, xpath, this.screenshot, this.report.bugId);
                        if(result == 'success'){
                            this.$emit('reselected', {bugId: this.report.bugId, xpath: xpath});
                            this.close();
                        } else {
                            alert(`Sorry something went wrong. Please try later`);
                            this.submitInPorgress = false;
                        }                  
                    } catch(error) {
                        console.log(error);
                        alert(`Sorry something went wrong. Please try later`);
                        this.submitInPorgress = false;
                    }
                }
                
            },

            startSelect(){
                const els = document.querySelectorAll('.ui-br-ext-outlined-element');
                this.removeClickBlocker(els);
                this.removeBugCoverEls();
                this.onSelect();
            },

            removeBugCoverEls(){
                const els = document.querySelectorAll('.ui-br-ext-bug-cover')
                    
                els.forEach(el => {
                    el.remove()
                });
            },

            async getScreenshot(){
                this.$emit('toggle-extension');
                this.screenshot = await this.onGetScreenshot();
                this.$emit('toggle-extension');
            },

            close(){
                this.removeClickFromBody(this.getMouseCoordinates);
                this.$emit('close-reselect')
            },
        }
    }
</script>