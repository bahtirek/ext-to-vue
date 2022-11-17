<template>
    <div >  
        <div class="ui-br-ext-close-details" @click="close">Close</div>  
        <div class="ui-br-ext-spacer-3"></div>
        <div  class="ui-br-ext-review-card">
            <p>Select an element from page to:</p>
            <ul class="ui-br-ext-default-list">
                <li>Update the existing screenshot of the bug.</li>
                <li>Update the xpath of the element.</li>
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
    import eventBus from '../../../eventBus.js';

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
                if(!globalStore.store.dynamicDomFlow) {
                    await this.getScreenshot();
                } else {
                    this.screenshot = globalStore.store.screenshot;
                }
                const xpath = this.getElementXpath(globalStore.store.selectedElement);
                if(this.screenshot && xpath) {
                    try {
                        await this.patch(this.account, xpath, this.screenshot, this.report.bugId);
                        this.$emit('reselected', {bugId: this.report.bugId, xpath: xpath});
                        this.close();                 
                    } catch(error) {
                        console.log(error);
                        if(error.result?.message) {
                            eventBus.$emit('toggle-toast', { text: error.result?.message, danger: true })
                        } else {
                            eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                        }
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