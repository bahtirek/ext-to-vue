<template>
    <div class="ui-br-ext-file-upload-comp">
        <div class="ui-br-ext-file-upload" >
            <label for="ui-br-ext-upload">Attach files <span>(image, video, doc, pdf)</span></label>
            <input type="file" ref="file" @change="addFile" id="ui-br-ext-upload" name="ui-br-ext-upload" accept="image/*, video/*, .pdf, .doc, .docx">
            <ul>
                <li v-for="(file, index) in files" :key="file.name">  
                    <span class="ui-br-ext-spinner active" v-if="!file.id"></span>
                    <span @click="removeFile(index)" v-if="file.id">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f04242" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="ui-br-ext-feather feather-x">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </span>
                    <span>{{file.name}}</span>
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
            this.deleteFile = reportService.deleteFile;
        },

        mounted: function () {
        },

        data() {
            return {
                files: []
            }
        },

        methods: {
            async addFile(){
                const ext = /(\.jpg|\.jpeg|\.bmp|\.gif|\.png|\.webm|\.avi|\.mpeg|\.mkv|\.doc|\.docx|\.xls|\.xlsx|\.pdf)$/i;
                const file = this.$refs.file.files[0];
                const name = file.name;
                
                if(file.size > 50000000) {
                    alert('File size cannot exceed 50mb');
                    return false;
                }

                if (!ext.exec(name)) {
                    alert("File extension not supported!");
                    return false;
                } 
                this.files.push({name: name, id: ''});
                this.uploadFile(file, this.files.length-1);
            },

            async uploadFile(file, index){
                const formData = new FormData;
                formData.append('attachment', file);

                try {
                    const result = await this.postFiles(this.account, formData);

                    if(result){
                        this.files[index]['id'] = result.result;
                    }                    
                } catch(error) {
                    alert(`Sorry something went wrong, we couldn't upload the file(s).`);
                    this.files.splice(index);                 
                }
            },

            async removeFile(index){
                const id = this.files[index]['id'];
                try {
                    const result = await this.deleteFile(this.account, id);

                    if(result){
                        this.files.splice(index)
                    }                    
                } catch {
                    alert(`Sorry something went wrong, we couldn't delete the file(s).`);
                }
            },

            getFiles(){
                return this.files.map((file)=> file.id)
            }
        }
    }
</script>

