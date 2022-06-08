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
            reject(error);
        });
    })
}


const deleteFile = (account, uuid, bugId) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${account.repositoryServer}/attachment`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                attachment_uuid: uuid,
                bugId: bugId
            }
        }).then(function (response) {
            resolve(response.data)
        }).catch(function (error) {
            reject(error);
        });
    })
}

const deleteTempFile = (account, uuid) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${account.repositoryServer}/temp_attachment`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                attachment_uuid: uuid
            }
        }).then(function (response) {
            resolve(response.data)
        }).catch(function (error) {
            reject(error);
        });
    })
}

export default {
    postFiles,
    deleteTempFile,
    deleteFile,
}