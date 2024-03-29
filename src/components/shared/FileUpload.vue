<template>
    <div class="ui-br-ext-file-upload-comp">
        <div class="ui-br-ext-file-upload" >
            <label for="ui-br-ext-upload">Attach files <span>(image, video, doc, pdf)</span></label>
            <input type="file" ref="file" @change="addFile" id="ui-br-ext-upload" name="ui-br-ext-upload" accept="image/*, video/*, .pdf, .doc, .docx">
            <ul>
                <li v-for="(file, index) in files" :key="index">  
                    <span class="ui-br-ext-spinner active" v-if="!file.uuid"></span>
                    <span @click="removeFile(index)" v-if="file.uuid">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f04242" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="ui-br-ext-feather feather-x">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </span>
                    <span>{{file.fileName}}</span>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>

    import fileService from '../../services/file.service';
    import eventBus from '../../eventBus';
            
    export default {
        name: 'FileUpload',

        props: [
            'account',
            'report'
        ],

        components: {
            
        },
        
        created() { 
            this.postFiles = fileService.postFiles;
            this.deleteTemp = fileService.deleteTempFile;
            this.delete = fileService.deleteFile;
        },

        mounted: function () {
            this.setFormValue()
        },

        data() {
            return {
                files: [],
                newUploads: [],
                filesToRemove:[]
            }
        },

        methods: {
            async addFile(event){
                const ext = /(\.jpg|\.jpeg|\.bmp|\.gif|\.svg|\.png|\.webm|\.avi|\.mpeg|\.mkv|\.doc|\.docx|\.xls|\.xlsx|\.pdf)$/i;
                const file = this.$refs.file.files[0];
                if(!file) return false;
                const fileName = file.name;
                
                if(file.size > 50000000) {
                    eventBus.$emit('toggle-toast', { text: 'File size cannot exceed 50mb', danger: true });
                    return false;
                }

                if (!ext.exec(fileName)) {
                    eventBus.$emit('toggle-toast', { text: 'File extension not supported!', danger: true });
                    return false;
                } 
                this.files.push({fileName: fileName, uuid: ''});
                this.uploadFile(file, this.files.length-1);
                event.target.value = "";
            },

            async uploadFile(file, index){
                const formData = new FormData;
                formData.append('attachment', file);

                try {
                    const result = await this.postFiles(this.account, formData);
                    if(result){
                        this.files[index]['uuid'] = result.result;
                        this.newUploads.push(result.result);
                    }                    
                } catch(error) {
                    this.files.splice(index, 1); 
                    if(error.result?.message) {
                        eventBus.$emit('toggle-toast', { text: error.result?.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }                
                }
            },

            async removeFile(index){
                const uuid = this.files[index]['uuid'];
                if (this.files[index]['path']) {
                    this.filesToRemove.push(uuid);
                    this.files.splice(index, 1);
                } else {
                    this.deleteTempFile(index, uuid)
                }
                
            },

            async deleteFiles(){
                this.filesToRemove.forEach((uuid) => {
                    this.deleteFile(uuid)
                })
            },

            async deleteFile(uuid){
                try {
                    const result = this.delete(this.account, uuid, this.report.bugId); 
                    if(result.result == "success"){
                        const index = this.filesToRemove.findIndex(id => id == uuid)
                        this.filesToRemove.splice(index)
                    }                     
                } catch(error) {
                    console.log(error);
                    if(error.result?.message) {
                        eventBus.$emit('toggle-toast', { text: error.result?.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }
                }                
            },

            async deleteTempFile(index, uuid){
                try {
                    const result = await this.deleteTemp(this.account, uuid);
                    if(result.result == "success"){
                        this.files.splice(index, 1)
                        const newUploadIndex = this.newUploads.findIndex(id => id == uuid)
                        this.newUploads.splice(newUploadIndex, 1)
                    }                    
                } catch(error) {
                    if(error.result?.message) {
                        eventBus.$emit('toggle-toast', { text: error.result?.message, danger: true })
                    } else {
                        eventBus.$emit('toggle-toast', { text: 'Sorry something went wrong.', danger: true })
                    }
                }
            },

            setFormValue(){
                let count = 1;
                if(this.report && this.report.attachments) {
                    this.files = this.report.attachments
                }
            },

            getFiles(){
                return this.files.map((file)=> file.uuid)
            },

            getNewUploads(){
                return this.newUploads
            }
        }
    }
</script>

