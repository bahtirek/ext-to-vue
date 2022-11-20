import axios from 'axios';

const patchStatus = (account, lkBugStatusId, bugId) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${account.repositoryServer}/bug-status`, {
            registrationKey: account.registrationKey, 
            token: account.token,
            uuid: account.uuid,
            bugId: bugId,
            lkBugStatusId: lkBugStatusId
        }).then(function (response) {
            resolve(response.data.result)
        }).catch(function (error) {
            reject(error.response.data);
        });
    });
}


const getStatusList = (account) => {
    return new Promise((resolve, reject) => {       
        axios.get(`${account.repositoryServer}/bug-status-list`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid
            }
        }).then(function (response) {
            resolve(response.data.result)
        }).catch(function (error) {
            console.log(error.reponse);
            reject(error.response.data);
        });     
    })
}


export default {
    patchStatus,
    getStatusList
}