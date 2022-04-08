<template>
    <div class="ui-br-ext-file-upload-comp">
        <div class="ui-br-ext-file-upload" >
            <label for="ui-br-ext-screenshot">Replace screenshot <span>(png, jpeg)</span></label>
            <input type="file" ref="screenshot" @change="replaceScreenshot" id="ui-br-ext-screenshot" name="ui-br-ext-screenshot" accept="image/*">
            <ul>
                <li>  
                    <span class="ui-br-ext-spinner active" v-if="!screenshot.id"></span>
                    <span @click="screenshot={}" v-if="screenshot.id">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f04242" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="ui-br-ext-feather feather-x">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </span>
                    <span>{{screenshot.name}}</span>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>

    import reportService from '../../services/save-report.service'
            
    export default {
        name: 'ReplaceScreenshot',

        props: [
            'account'
        ],

        components: {
            
        },
        
        created() { 
            this.postFiles = reportService.postFiles;
            this.deleteFile = reportService.deleteFile;
        },

        mounted: function () {
        },

        data() {
            return {
                screenshot: {}
            }
        },

        methods: {

            async replaceScreenshot(){
                const ext = /(\.jpg|\.jpeg|\.png)$/i;
                const file = this.$refs.screenshot.files[0];
                const name = file.name;
                
                if(file.size > 50000000) {
                    alert('File size cannot exceed 50mb');
                    return false;
                }

                if (!ext.exec(name)) {
                    alert("File extension not supported!");
                    return false;
                }
                
                this.screenshot = {name: name, id: ''};
                this.uploadFile(file);
            },

            async uploadFile(file){
                const formData = new FormData;
                formData.append('attachment', file);

                try {
                    const result = await this.postFiles(this.account, formData);
                    if(result){
                        this.screenshot.id = result.result;
                    }                    
                } catch(error) {
                    alert(`Sorry something went wrong, we couldn't upload the file(s).`);
                    this.screenshot = {}
                }
            },

            async removeFile(index){
                const id = this.screenshot.id;
                try {
                    const result = await this.deleteFile(this.account, id);
                    if(result.result == "success"){
                        this.screenshot = {}
                    }                    
                } catch {
                    alert(`Sorry something went wrong, we couldn't delete the file(s).`);
                }
            },

            getFiles(){
                return this.screenshot;
            }
        }
    }
</script>

