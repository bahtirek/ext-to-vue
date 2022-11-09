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
        axios.get(`${URL}/user-profiles`, {
            params: {
                RegistrationKey: "1636b16263fc27",
                UserEmail: "uzsultanov@gmail.com",
                UserAppId: "0e08d1f4-a6d3-49f4-a379-1371bc3cf4fc",
                query: "uzsultanov@gmail.com"
            }
        }).then(function (response) {
            console.log(response);
            resolve(response.data.result)
        }).catch(function (error) {
            console.log(error.reponse);
            reject(error.response);
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