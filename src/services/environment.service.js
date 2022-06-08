
import axios from 'axios';

const postEnvironment = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${data.repositoryServer}/environment`, {
            registrationKey: data.registrationKey, 
            token: data.token,
            uuid: data.uuid,
            name: data.name
        }).then(function (response) {
            resolve(response.data)
        }).catch(function (error) {
            reject(error.response.data);
        });
    });
}

const patchEnvironment = (data) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${data.repositoryServer}/environment`, {
            registrationKey: data.registrationKey, 
            token: data.token,
            uuid: data.uuid,
            name: data.name,
            environmentId: data.environmentId
        }).then(function (response) {
            resolve(response.data)
        }).catch(function (error) {
            console.log(error.response);
            reject(error.response.data);
        });
    });
}


const getEnvironments = (account, query) => {
    return new Promise((resolve, reject) => {       
        axios.get(`${account.repositoryServer}/environment`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                query: query
            }
        }).then(function (response) {
            resolve(response.data.result)
        }).catch(function (error) {
            console.log(error.reponse);
            reject(error.response.data);
        });     
    })
}

const deleteEnvironment = (environmentId, account) => {
    return new Promise((resolve, reject) => {       
        axios.delete(`${account.repositoryServer}/environment`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                environmentId: environmentId
            }
        }).then(function (response) {
            resolve(response.data)
        }).catch(function (error) {
            console.log(error.reponse);
            reject(error.response.data);
        });     
    })
}

export default {
    postEnvironment,
    patchEnvironment,
    getEnvironments,
    deleteEnvironment
}