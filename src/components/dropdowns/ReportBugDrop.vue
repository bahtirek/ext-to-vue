<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-report-bug" id="ui-br-ext-report-bug">
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
                    <textarea name="ui-br-ext-description" id="ui-br-ext-description" rows="2" data-gramm="false"></textarea>
                </div>
                <div class="ui-br-ext-form-container ui-br-ext-textarea">
                    <label for="ui-br-ext-act-results">Actual results</label>
                    <textarea name="ui-br-ext-act-results" id="ui-br-ext-act-results" rows="3" data-gramm="false"></textarea>
                </div>
                <div class="ui-br-ext-form-container ui-br-ext-textarea">
                    <label for="ui-br-ext-exp-results">Expected results</label>
                    <textarea name="ui-br-ext-exp-results" id="ui-br-ext-exp-results" rows="3" data-gramm="false"></textarea>
                </div>
                <div class="ui-br-ext-form-container ui-br-ext-textarea">
                    <label for="ui-br-ext-rep-steps">Steps to reproduce</label>
                    <textarea name="ui-br-ext-rep-steps" id="ui-br-ext-rep-steps" rows="3" data-gramm="false"></textarea>
                </div>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-checkbox">
                <input type="checkbox" name="jira" id="ui-br-ext-save-to-jira">
                <label for="ui-br-ext-save-to-jira">Create Jira ticket on save</label>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-checkbox">
                <input type="checkbox" name="pdf" id="ui-br-ext-save-to-pdf">
                <label for="ui-br-ext-save-to-pdf">Save as PDF</label>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-checkbox">
                <input type="checkbox" name="screenshot" id="ui-br-ext-save-screenshot">
                <label for="ui-br-ext-save-to-screenshot">Attach screenshot</label>
                <span class="ui-br-ext-disclaimer">Make sure to remove personal identity information</span>
            </div>
            <button class="ui-br-ext-btn" id="ui-br-ext-save-report" data-listener="off">
                <span>Save</span> 
            </button>
            <div class="ui-br-ext-box-resize" id="ui-br-comment-boxResize">
                <svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" focusable="false"
                    role="img" width="128" height="128" fill="currentColor">
                    <path d="M33,11H3a1,1,0,0,0,0,2H33a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-1" />
                    <path d="M28,17H8a1,1,0,0,0,0,2H28a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-2" />
                    <path d="M23,23H13a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"
                        class="ui-br-ext-clr-i-outline clr-i-outline-path-3" /></svg>
            </div>
        </div>
</template>

<script>

    //import operators from '../../shared/operators';

    export default {
        name: 'ReportBugDrop',
        
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

            toggleDrop(e) {
                //this.next = this.activateOperator(e.currentTarget);
                this.$emit('toggle-button', e.currentTarget);
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