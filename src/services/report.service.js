import axios from 'axios';

const postReport = (account, report) => {
    let saveToJira = report.saveToJira? 1 : 0;
    console.log(saveToJira); 
    if(!report.screenshot){
        report.screenshot = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAooAAAFnCAYAAAAhRmhNAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAFoOSURBVHhe7d0HvBTV2fjxZ+nNWEHaRbpGfd/wioWiRo0iIia+VhQR7MYS/ScaKyAXe0k0ltiigqIg4JtEuCAxYKNagu+rsdC5IFdUQKUIAvs/z8yZmTO7s+VeOvy+fPbD3dmdmTNnZneeec6ZPQIAAAAAu4xFTZuesrhZsy+/aNZsweImTbrZyQAAoBKq2f+BnUpK5C7zaGT+bJGqVm2gPxUAAFQGgSJ2SiZI3GD/lHQ6vd7+CQAAKoFAETslExxenxaZb/`
    }
    return new Promise((resolve, reject) => {
        axios.post(`${account.repositoryServer}/bug`, {
            registrationKey: account.registrationKey, 
            token: account.token,
            uuid: account.uuid,
            moduleId: report.module.moduleId,
            actualResult: report.actualResult,
            description: report.description,
            stepsToReproduce: report.stepsToReproduce,
            expectedResult: report.expectedResult,
            xpath: report.xpath,
            screenshot: report.screenshot,
            attachments: report.attachments,
            title: report.title,
            environmentId: report.environment.environmentId,
            url: window.location.href,
            saveToJira: saveToJira,
            jiraSettings: account.jiraSettings
        }).then(function (response) {
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
const postJira = (account, bugId) => {
    
    return new Promise((resolve, reject) => {
        axios.post(`${account.repositoryServer}/jira-issue`, {
            registrationKey: account.registrationKey, 
            token: account.token,
            uuid: account.uuid,
            bugId: bugId,
            jiraSettings: account.jiraSettings
        }).then(function (response) {
            console.log(response);
            resolve(response.data)
        }).catch(function (error) {
            console.log(error);
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
const patchReport = (account, report) => {

    return new Promise((resolve, reject) => {
        axios.patch(`${account.repositoryServer}/bug`, {
            registrationKey: account.registrationKey, 
            token: account.token,
            uuid: account.uuid,
            moduleId: report.module.moduleId,
            actualResult: report.actualResult,
            description: report.description,
            stepsToReproduce: report.stepsToReproduce,
            expectedResult: report.expectedResult,
            xpath: report.xpath,
            bugId: report.bugId,
            attachments: report.attachments,
            title: report.title,
            environmentId: report.environment.environmentId,
            url: window.location.href
        }).then(function (response) {
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

const formatDate = (date) => {
    const arr = date.split("-")
    return `${arr[1]}/${arr[2]}/${arr[0]}`
}


const getReports = (account, environmentId, moduleId, from, to, includeCompleted, includeCanceled) => {
    from = formatDate(from);
    to = formatDate(to);
    includeCompleted = includeCompleted == true ? 1 : 0
    includeCanceled = includeCanceled == true ? 1 : 0
    return new Promise((resolve, reject) => {       
        axios.get(`${account.repositoryServer}/bug`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                environmentId: environmentId,
                moduleId: moduleId,
                fromDate: from,
                toDate: to,
                includeCompleted: includeCompleted,
                includeCanceled: includeCanceled
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
const getGlobalReports = (account, searchQuery, includeCompleted, includeCanceled) => {
    includeCompleted = includeCompleted == true ? 1 : 0
    includeCanceled = includeCanceled == true ? 1 : 0
    return new Promise((resolve, reject) => {       
        axios.get(`${account.repositoryServer}/bug-global-search`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                query: searchQuery,
                includeCompleted: includeCompleted,
                includeCanceled: includeCanceled
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

const getScreenshotBlob = (account, bugId) => {
    return new Promise((resolve, reject) => {       
        axios.get(`${account.repositoryServer}/screenshot-blob`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                bugId: bugId
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

const getReportDetails = (account, bugId) => {
    return new Promise((resolve, reject) => {       
        axios.get(`${account.repositoryServer}/bug-details`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                bugId: bugId
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
    postReport,
    patchReport,
    getReports,
    getReportDetails,
    getGlobalReports,
    getScreenshotBlob,
    postJira
}