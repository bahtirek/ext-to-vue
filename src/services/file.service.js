import axios from 'axios';

const postFiles = (account, formData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${account.repositoryServer}/attachment`,  formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid
            }
        }).then(function (response) {
            resolve(response.data)
        }).catch(function (error) {
            if (error.response) {
                if(error.response.status == 401){
                    alert("Unauthorized");
                    return false
                }
                console.log(error.response.data);
                reject(error);
            } else if (error.request) {
                alert('Please check connection');
            } else {
                alert('Sorry, something went wrong please try again later');
            }
        });
    })
}


const deleteFile = (account, id) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${account.repositoryServer}/temp_attachment`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                attachment_uuid: id
            }
        }).then(function (response) {
            resolve(response.data)
        }).catch(function (error) {
            if (error.response) {
                if(error.response.status == 401){
                    alert("Unauthorized");
                    return false
                }
                console.log(error.response.data);
                reject(error);
            } else if (error.request) {
                alert('Please check connection');
            } else {
                alert('Sorry, something went wrong please try again later');
            }
        });
    })
}

export default {
    postFiles,
    deleteFile
}