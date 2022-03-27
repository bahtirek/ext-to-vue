
import axios from 'axios';

const postModule = (data) => {
    let saveToJira = 0;
    if (data.saveToJira) saveToJira = 1;
    console.log(data);
    console.log(saveToJira);
    return new Promise((resolve, reject) => {
        axios.post(`${data.repositoryServer}/module`, {
            registrationKey: data.registrationKey, 
            token: data.token,
            uuid: data.uuid,
            name: data.name,
            description: data.description,
            projectId: data.projectId
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

const patchModule = (data) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${data.repositoryServer}/module`, {
            registrationKey: data.registrationKey, 
            token: data.token,
            uuid: data.uuid,
            name: data.name,
            description: data.description,
            projectId: data.projectId,
            lkModuleStatusId: data.lkModuleStatusId,
            id: data.id
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


const getModules = (account, query, projectId) => {
    console.log(account.registrationKey);
    console.log(account.token);
    console.log(projectId);
    return new Promise((resolve, reject) => {       
        axios.get(`${account.repositoryServer}/module`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                query: query,
                projectId: projectId,
                //includeInactive: account.isAdmin
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

const deleteModule = (id, account, projectId) => {
    console.log(id);
    console.log(account.token);
    return new Promise((resolve, reject) => {       
        axios.delete(`${account.repositoryServer}/module`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                id: id
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
    postModule,
    patchModule,
    getModules,
    deleteModule
}