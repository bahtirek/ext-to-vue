import axios from 'axios';

const patchStatus = (account, lkBugStatusId, bugId) => {
    console.log(account, lkBugStatusId, bugId);
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
            if (error.response) {
                if(error.response.status == 401){
                    alert("Unauthorized");
                    return false
                }
                console.log(error.response.data);
                reject(error.response.data);
            } else if (error.request) {
                alert('Please check connection');
            } else {
                alert('Sorry, something went wrong please try again later');
            }
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
            if (error.response) {
                if(error.response.status == 401){
                    alert("Unauthorized");
                    return false
                }
                reject(error.response.data);
            } else if (error.request) {
                alert('Please check connection');
            } else {
                alert('Sorry, something went wrong please try again later');
            }
        });     
    })
}


export default {
    patchStatus,
    getStatusList
}