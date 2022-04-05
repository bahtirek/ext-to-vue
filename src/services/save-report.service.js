import axios from 'axios';

const postReport = (account, moduleId, report) => {
    console.log(account, moduleId, report);
    if(!report.screenshot){
        report.screenshot = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAooAAAFnCAYAAAAhRmhNAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAFoOSURBVHhe7d0HvBTV2fjxZ+nNWEHaRbpGfd/wioWiRo0iIia+VhQR7MYS/ScaKyAXe0k0ltiigqIg4JtEuCAxYKNagu+rsdC5IFdUQKUIAvs/z8yZmTO7s+VeOvy+fPbD3dmdmTNnZneeec6ZPQIAAAAAu4xFTZuesrhZsy+/aNZsweImTbrZyQAAoBKq2f+BnUpK5C7zaGT+bJGqVm2gPxUAAFQGgSJ2SiZI3GD/lHQ6vd7+CQAAKoFAETslExxenxaZb/`
    }
    return new Promise((resolve, reject) => {
        axios.post(`${account.repositoryServer}/bug`, {
            registrationKey: account.registrationKey, 
            token: account.token,
            uuid: account.uuid,
            moduleId: moduleId,
            actualResult: report.actualResults,
            description: report.description,
            stepsToReproduce: report.stepsToReproduce,
            expectedResult: report.expectedResults,
            xpath: report.xPath,
            screenshot: report.screenshot,
            attachments: report.attachments
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




const getReports = (account, query, projectId) => {
    console.log(account.registrationKey);
    console.log(account.token);
    console.log(projectId);
    return new Promise((resolve, reject) => {       
        axios.get(`${account.repositoryServer}/bug`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
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


const postVideo = (blob)=>{
    console.log(blob);
    axios.post(`https://extension-service.evendor.app/api/blob`, {
        
            registrationKey: "sup_61b589b5f03c42.30439098.1",
            token: "$5$rounds=5000mzcHt$J7H3Jh573tRrLtfPDDfbKxo8KhkmIRxeAdH7BHREUq7",
            uuid: "70ca7b25-24b4-40a5-8320-a9e105f65fb3",
            blob: blob
        
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error.reponse);
    });
}

const postFiles = (account, formData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${account.repositoryServer}/attachment`,  formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid
            }
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
                reject(error);
            } else if (error.request) {
                alert('Please check connection');
            } else {
                alert('Sorry, something went wrong please try again later');
            }
        });
    })
}
const deleteFile = (account, id) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${account.repositoryServer}/temp_attachment`, {
            params: {
                registrationKey: account.registrationKey, 
                token: account.token,
                uuid: account.uuid,
                attachment_uuid: id
            }
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
                reject(error);
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
    getReports,
    postVideo,
    postFiles,
    deleteFile
}