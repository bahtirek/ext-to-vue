<template>
    <div >  
        <div class="ui-br-ext-close-details" @click="close">Close</div>  
        <div class="ui-br-ext-spacer-3"></div>
        <div  class="ui-br-ext-review-card">
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-status">Status choice</label>
                <select id="ui-br-ext-status" name="status" v-model="lkBugStatusId">

                    <option v-for="(status, index) in statusList" :key="index" :value="status.lkBugStatusId">
                        {{status.description}}
                    </option>
                </select>
                <span class="ui-br-ext-message" v-if="count>0 && status==''">Field is required</span>
            </div>
            <div class="ui-br-ext-btn-group">
                <button class="ui-br-ext-btn" @click="updateStatus" data-listener="off">
                    <span class="ui-br-ext-spinner" :class="{ active: submitInPorgress }"></span>
                    <span>Update</span> 
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

    import statusService from '../../../services/status.service';
    import eventBus from '../../../eventBus';

    export default {
        name: 'StatusChoice',

        components: {
        },

        props: [
            'report',
            'account',
        ],

        created() { 
            this.update = statusService.patchStatus;
            this.getList = statusService.getStatusList;
            this.lkBugStatusId = "" + this.report.lkBugStatusId;
        },

        mounted() {
            this.getStatusList();
            this.lkBugStatusId = this.report.lkBugStatusId
        },

        data() {
            return {
                lkBugStatusId: undefined,
                submitInPorgress: false,
                statusList: [],
                count: 0
            }
        },

        methods: {

            async  updateStatus(){
                const status = parseInt(this.lkBugStatusId);
                if(status && status > 0) {
                    try {
                        const result = await this.update(this.account, status, this.report.bugId)
                        if(!result == "success") return false;
                        this.close();
                    } catch(error) {
                        console.log(error);
                        if(error.result?.message) {
                        eventBus.$emit('toggle-toast', { text: error.result?.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }
                    }
                } else {
                    this.count++
                }               
            },

            async  getStatusList(){
                try {
                    this.statusList = await this.getList(this.account);
                } catch(error) {
                    console.log(error);
                }
                              
            },

            close(){
                this.$emit('close-status')
            },
        }
    }
</script>