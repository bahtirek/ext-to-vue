
import axios from 'axios';

const postProject = (data) => {
    let saveToJira = 0;
    if (data.saveToJira) saveToJira = 1;
    return new Promise((resolve, reject) => {
        axios.post(`${data.repositoryServer}/project`, {
            registrationKey: data.registrationKey, 
            token: data.token,
            uuid: data.uuid,
            saveToJira: saveToJira,
            projectKey: data.projectKey,
            jiraId: data.jiraId,
            description: data.description,
        }).then(function (response) {
            resolve(response.data)
        }).catch(function (error) {
            reject(error.response.data);
        });
    });
}

const statusPatchProject = (data) => {

    return new Promise((resolve, reject) => {
        axios.patch(`${data.repositoryServer}/project-status`, {
            registrationKey: data.registrationKey, 
            token: data.token,
            uuid: data.uuid,
            lkProjectStatusId: data.lkProjectStatusId,
            id: data.id
        }).then(function (response) {
            resolve(response.data)
        }).catch(function (error) {
            console.log(error.response);
            reject(error.response.data);
        });
    });
}

const patchProject = (data) => {
    let saveToJira = 0;
    if (data.saveToJira) saveToJira = 1;

    return new Promise((resolve, reject) => {
        axios.patch(`${data.repositoryServer}/project`, {
            registrationKey: data.registrationKey, 
            token: data.token,
            saveToJira: saveToJira,
            uuid: data.uuid,
            projectKey: data.projectKey,
            description: data.description,
            jiraId: data.jiraId,
            lkProjectStatusId: data.lkProjectStatusId,
            id: data.id
        }).then(function (response) {
            resolve(response.data)
        }).catch(function (error) {
            console.log(error.response);
            reject(error.response.data);
        });
    });
}


const getProjects = (account, query) => {
    return new Promise((resolve, reject) => {       
        axios.get(`${account.repositoryServer}/project`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                query: query,
                includeInactive: account.isAdmin
            }
        }).then(function (response) {
            resolve(response.data.result)
        }).catch(function (error) {
            console.log(error.reponse);
            reject(error.response.data);
        });     
    })
}

const deleteProject = (id, account) => {
    return new Promise((resolve, reject) => {       
        axios.delete(`${account.repositoryServer}/project`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                id: id
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
    postProject,
    patchProject,
    getProjects,
    deleteProject,
    statusPatchProject
}