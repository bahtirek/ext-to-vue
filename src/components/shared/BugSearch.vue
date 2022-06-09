<template>

    <form class="ui-br-ext-report-form">
        <div class="ui-br-ext-form-container ui-br-ext-textarea">
            <label for="ui-br-ext-modules">Search by keyword</label>
            <input type="text" v-model="searchQuery" @keydown.enter="enterClicked" autocomplete="off">
            <span class="ui-br-ext-message" v-if="count > 0 && searchQuery==''" >Field cannot be empty</span>
            <span class="ui-br-ext-search-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ad55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span >
        </div>
        <div class="ui-br-ext-input-wrap">
            <div class="ui-br-ext-input-wrap-label">Include</div>
            <div class="ui-br-ext-form-container ui-br-ext-checkbox">
                <input type="checkbox" name="pdf" id="ui-br-ext-save-to-pdf" v-model="includeCompleted">
                <label for="ui-br-ext-save-to-pdf">Completed</label>
            </div>
            <div class="ui-br-ext-form-container ui-br-ext-checkbox">
                <input type="checkbox" name="pdf" id="ui-br-ext-send-email" v-model="includeCanceled">
                <label for="ui-br-ext-send-email">Canceled</label>
            </div>
        </div>
    </form >

</template>

<script>


    export default {
        name: 'BugSearch',

        props: [
        ],

        mounted() {
        },

        data() {
            return {
                searchQuery: '',
                count: 0,
                includeCompleted: false,
                includeCanceled: false,
            }
        },

        methods: {

            setFormValue(){
                if(this.oldEnvironment) {
                    this.searchQuery = this.oldEnvironment?.name ?? '';
                    this.environment = this.oldEnvironment;
                }
            },

            resetReportData(){
                this.searchQuery = ''
            },

            formValidation(){
                this.searchQuery = this.searchQuery.trim();
                if(this.searchQuery != '') return true

                this.count++
                return false
            },
            enterClicked(e){
                e.preventDefault();
                return false;
            }
        }
    }
</script>