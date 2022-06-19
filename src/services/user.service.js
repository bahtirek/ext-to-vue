import axios from 'axios';

const URL = 'https://extension-auth.evendor.app/api';

const postUser = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${URL}/user_profile`, data).then(function (response) {
            resolve(response.account)
        }).catch(function (error) {
            console.log(error);
            reject(error.response.data);
        });
    });
}

const patchUser = (account, email, emailId, isAdmin) => {
    isAdmin = isAdmin ? 1 : 0;
    return new Promise((resolve, reject) => {
        axios.patch(`${URL}/module`, {
            registrationKey: account.registrationKey, 
            token: account.token,
            uuid: account.uuid,
            email: email,
            emailId: emailId,
            isAdmin: isAdmin
        }).then(function (response) {
            resolve(response.account)
        }).catch(function (error) {
            reject(error.response.data);
        });
    });
}


const getUser = (account, query) => {
    return new Promise((resolve, reject) => {       
        axios.get(`${URL}/module`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                query: query
            }
        }).then(function (response) {
            resolve(response.account.result)
        }).catch(function (error) {
            console.log(error.reponse);
            reject(error.response.data);
        });     
    })
}

const deleteUser = (account, emailId) => {
    return new Promise((resolve, reject) => {       
        axios.delete(`${URL}/module`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                emailId: emailId
            }
        }).then(function (response) {
            resolve(response.account)
        }).catch(function (error) {
            console.log(error.reponse);
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