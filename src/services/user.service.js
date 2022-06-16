
import axios from 'axios';

const postUser = (account, email, isAdmin) => {
    isAdmin = isAdmin ? 1 : 0;
    return new Promise((resolve, reject) => {
        axios.post(`${account.repositoryServer}/module`, {
            registrationKey: account.registrationKey, 
            token: account.token,
            uuid: account.uuid,
            email: email,
            isAdmin: isAdmin
        }).then(function (response) {
            resolve(response.account)
        }).catch(function (error) {
            reject(error.response.account);
        });
    });
}

const patchUser = (account, email, emailId, isAdmin) => {
    isAdmin = isAdmin ? 1 : 0;
    return new Promise((resolve, reject) => {
        axios.patch(`${account.repositoryServer}/module`, {
            registrationKey: account.registrationKey, 
            token: account.token,
            uuid: account.uuid,
            email: email,
            emailId: emailId,
            isAdmin: isAdmin
        }).then(function (response) {
            resolve(response.account)
        }).catch(function (error) {
            reject(error.response.account);
        });
    });
}


const getUser = (account, query) => {
    return new Promise((resolve, reject) => {       
        axios.get(`${account.repositoryServer}/module`, {
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
            reject(error.response.account);
        });     
    })
}

const deleteUser = (account, emailId) => {
    return new Promise((resolve, reject) => {       
        axios.delete(`${account.repositoryServer}/module`, {
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
            reject(error.response.account);
        });     
    })
}

export default {
    postUser,
    patchUser,
    getUser,
    deleteUser
}