<template>
    <div class="ui-br-ext-file-upload-comp">
        <div class="ui-br-ext-file-upload" >
            <label for="ui-br-ext-upload">Attach files <span>(image, video, doc, pdf)</span></label>
            <input type="file" ref="file" @change="addFile" id="ui-br-ext-upload" name="ui-br-ext-upload" accept="image/*, video/*, .pdf, .doc, .docx">
            <ul>
                <li v-for="(file, index) in files" :key="file">  
                    <span @click="removeFile(file, index)">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f04242" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="ui-br-ext-feather feather-x">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </span>
                    <span>{{file}}</span>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>

    import reportService from '../../services/save-report.service'
            
    export default {
        name: 'FileUpload',

        props: [
            'account'
        ],

        components: {
            
        },
        
        created() { 
            this.postFiles = reportService.postFiles;
        },

        mounted: function () {
        },

        data() {
            return {
                formData: new FormData,
                files: []
            }
        },

        methods: {
            addFile(){
                console.log(this.$refs.file.files);
                let name = this.$refs.file.files[0]['name'];
                this.files.push(name);
                this.formData.append('attachments[' + name + ']', name);
            },

            async uploadFiles(bugId){

                try {
                    const result = await this.postFiles(this.account, this.formData, bugId);

                    console.log(result);
                    this.$emit('onFileUploadComplete', true)
                    if(result.result){
                        console.log(result.result);
                    }                    
                } catch(error) {
                    console.log(error.error);
                    alert(`Sorry something went wrong, we couldn't upload the file(s).`);
                    this.$emit('onFileUploadComplete', false);                   
                }
            },

            removeFile(file, index){
                this.formData.delete(`attachments[${file}]`);
                if (index || index >= 0) this.files.splice(index)
            }
        }
    }
</script>

