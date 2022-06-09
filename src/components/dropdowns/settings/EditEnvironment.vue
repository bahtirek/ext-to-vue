<template>
    
    <div>
        <div class="ui-br-ext-form-title">{{action}}</div >

        <form novalidate name="ui-br-ext-new-module" onsubmit="return false">
            <div class="ui-br-ext-form-container ui-br-ext-textarea">
                <label for="ui-br-ext-new-module-label">Environment name</label>
                <input type="text" name="ui-br-ext-new-module-label" autocomplete="off" v-model="newEnvironment.name" maxlength="50" minlength="2"/>
                <span class="ui-br-ext-message">{{errorMessage.name}}</span>
            </div>
        </form>
        <div class="ui-br-ext-btn-group">
            <button class="ui-br-ext-btn" @click="deleteEnvironment" data-listener="off" v-if="newEnvironment.environmentId && newEnvironment.allowDelete">
                <span class="ui-br-ext-spinner"></span>
                <span>Delete</span> 
            </button>
            <button class="ui-br-ext-btn" @click="saveEnvironment" data-listener="off">
                <span class="ui-br-ext-spinner"></span>
                <span>Save</span> 
            </button>
            <button class="ui-br-ext-btn-danger" @click="resetEnvironment()" data-listener="off">
                <span class="ui-br-ext-spinner"></span>
                <span>Cancel</span> 
            </button>
        </div>
    </div>
        
</template>


<script>
    import environmentService from '../../../services/environment.service';
    import eventBus from './../../../eventBus';

    export default {
        name: 'EditEnvironment',

        props: [
            'environment',
            'account'
        ],

        mounted() {
            this.isEditing()
        },

        created() {
            this.post = environmentService.postEnvironment;
            this.patch = environmentService.patchEnvironment;
            this.delete = environmentService.deleteEnvironment;
        },

        data() {
            return {
                newEnvironment: {
                    name: '',
                },
                errorMessage: {name: ''},
                action: 'Add environment',
            }
        },

        methods: {
            async saveEnvironment(){

                this.errorMessage.name = '';
                this.newEnvironment.name = this.newEnvironment.name.trim();
                if(this.newEnvironment.name && this.newEnvironment.name != ''){

                    try {
                        let environment = undefined;

                        if (this.newEnvironment.environmentId) {
                            environment = await this.patch({...this.newEnvironment, ...this.account});
                        } else {
                            environment = await this.post({...this.newEnvironment, ...this.account});
                        }
                        
                        if(environment){ 
                            this.$emit('saveEnvironment', environment.result)
                        }                    
                    } catch(error) {
                        eventBus.$emit('toggle-toast', { text: 'Check the error', danger: true })
                        console.log(error.error);
                        this.errorMessage.name = error.error
                    }                                      
                } else {
                    this.errorMessage.name = 'Enter environment key'
                }
            },

            resetEnvironment() {
                this.newEnvironment.name = '';
                this.action = 'Create new environment';
                delete this.newEnvironment;
                this.$emit('cancelEditing');
            },

            async deleteEnvironment(environment) {
                if (confirm('Are you suuure?')) {
                    try {
                        await this.delete(this.environment.environmentId, this.account);
                        eventBus.$emit('toggle-toast', { text: 'Environment deleted', danger: false })
                        this.$emit('deleteEnvironment')
                    } catch(error) {
                        if(error.result.message) {
                            eventBus.$emit('toggle-toast', { text: error.result.message, danger: true })
                        } else {
                            eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                        }
                        console.log(error);
                    }
                }
            },

            isEditing() {
                if(this.environment && this.environment.environmentId) {
                    this.action = 'Edit environment';
                    this.newEnvironment = {...this.environment};
                }
            }
        }
    }
</script>