
import axios from 'axios';

const postProject = (data) => {
    let saveToJira = 0;
    if (data.saveToJira) saveToJira = 1;
    console.log(data);
    console.log(saveToJira);
    return new Promise((resolve, reject) => {
        axios.post(`${data.repositoryServer}/project`, {
            registrationKey: data.registrationKey, 
            token: data.token,
            saveToJira: saveToJira,
            projectKey: data.projectKey,
            jiraId: data.jiraId
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

const statusPatchProject = (data) => {
    console.log(data);

    return new Promise((resolve, reject) => {
        axios.patch(`${data.repositoryServer}/project-status`, {
            registrationKey: data.registrationKey, 
            token: data.token,
            lkProjectStatusId: data.lkProjectStatusId,
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

const patchProject = (data) => {
    let saveToJira = 0;
    if (data.saveToJira) saveToJira = 1;
    console.log(data);

    return new Promise((resolve, reject) => {
        axios.patch(`${data.repositoryServer}/project`, {
            registrationKey: data.registrationKey, 
            token: data.token,
            saveToJira: saveToJira,
            projectKey: data.projectKey,
            jiraId: data.jiraId,
            lkProjectStatusId: data.lkProjectStatusId,
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


const getProjects = (account, query) => {
    return new Promise((resolve, reject) => {       
        axios.get(`${account.repositoryServer}/project`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                query: query,
                includeInactive: account.isAdmin
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

const deleteProject = (id, account) => {
    console.log(id);
    console.log(account.token);
    return new Promise((resolve, reject) => {       
        axios.delete(`${account.repositoryServer}/project`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
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
    postProject,
    patchProject,
    getProjects,
    deleteProject,
    statusPatchProject
}