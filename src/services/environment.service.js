
import axios from 'axios';

const postEnvironment = (data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
        axios.post(`${data.repositoryServer}/environment`, {
            registrationKey: data.registrationKey, 
            token: data.token,
            uuid: data.uuid,
            name: data.name
        }).then(function (response) {
            console.log(response);
            resolve(response.data)
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

const patchEnvironment = (data) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${data.repositoryServer}/environment`, {
            registrationKey: data.registrationKey, 
            token: data.token,
            uuid: data.uuid,
            name: data.name,
            environmentId: data.environmentId
        }).then(function (response) {
            console.log(response.data);
            resolve(response.data)
        }).catch(function (error) {
            
            console.log(error.response);
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
            console.log(response);
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

const deleteEnvironment = (environmentId, account) => {
    console.log(environmentId);
    console.log(account.token);
    return new Promise((resolve, reject) => {       
        axios.delete(`${account.repositoryServer}/environment`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                environmentId: environmentId
            }
        }).then(function (response) {
            console.log(response.data);
            resolve(response.data)
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
    postEnvironment,
    patchEnvironment,
    getEnvironments,
    deleteEnvironment
}