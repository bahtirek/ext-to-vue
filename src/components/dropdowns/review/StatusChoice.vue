<template>
    <div >  
        <div class="ui-br-ext-close-details" @click="close">Close</div>  
        <div class="ui-br-ext-spacer-3"></div>
        <div  class="ui-br-ext-review-card">
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-status">Status choice</label>
                <select id="ui-br-ext-status" name="status" v-model="status">
                    <option disabled value="">Please select one</option>
                    <option value="active">Active</option>
                    <option value="inProgress">In progress</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
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

    import reportService from '../../../services/report.service';
    import { globalStore } from './../../../main';

    export default {
        name: 'StatusChoice',

        components: {
        },

        props: [
            'projectId',
            'account',
        ],

        created() { 
            this.update = reportService.updateStatus;
        },

        mounted() { 
            
        },

        data() {
            return {
                status: '',
                count: 0,
                submitInPorgress: false
            }
        },

        methods: {

            async  updateStatus(){
                console.log(this.status);
                if(this.status && this.status.length > 0) {
                    this.submitInPorgress = true;
                    try {
                        console.log(this.status);
                        this.submitInPorgress = false;
                        this.close();
                    } catch(error) {
                        console.log(error);
                        this.submitInPorgress = false;
                    }
                } else {
                    this.count++
                }               
            },

            close(){
                this.$emit('close-status')
            },
        }
    }
</script>