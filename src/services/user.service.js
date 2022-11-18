import axios from 'axios';

const URL = 'https://extension-auth.evendor.app/api';

const postUser = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${URL}/user_profile`, data).then(function (response) {
            resolve(response.account)
        }).catch(function (error) {
            reject(error.response.data);
        });
    });
}

const patchUser = (data) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${URL}/user-profile`, data).then(function (response) {
            resolve(response.account)
        }).catch(function (error) {
            reject(error.response.data);
        });
    });
}


const getUser = (account, query) => {
    return new Promise((resolve, reject) => {       
        axios.get(`${URL}/user-profile`, {
            params: {
                RegistrationKey: account.registrationKey,
                UserEmail: account.userEmail,
                UserAppId: account.userAppId,
                query: query
            }
        }).then(function (response) {
            resolve(response.data.result)
        }).catch(function (error) {
            reject(error.response);
        });     
    })
}

const deleteUser = (account, UserProfileId) => {
    return new Promise((resolve, reject) => {       
        axios.delete(`${URL}/user-profile`, {
            params: {
                RegistrationKey: account.registrationKey, 
                UserEmail: account.userEmail, 
                UserAppId: account.userAppId,  
                UserProfileId: UserProfileId
            }
        }).then(function (response) {
            resolve(response.account)
        }).catch(function (error) {
            reject(error.response.data);
        });     
    })
}

export default {
    postUser,
    patchUser,
    getUser,
    deleteUser
}