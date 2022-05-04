import axios from 'axios';

const getPdf = (report, account) => {
    if(!report.screenshot){
        report.screenshot = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAooAAAFnCAYAAAAhRmhNAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAFoOSURBVHhe7d0HvBTV2fjxZ+nNWEHaRbpGfd/wioWiRo0iIia+VhQR7MYS/ScaKyAXe0k0ltiigqIg4JtEuCAxYKNagu+rsdC5IFdUQKUIAvs/z8yZmTO7s+VeOvy+fPbD3dmdmTNnZneeec6ZPQIAAAAAu4xFTZuesrhZsy+/aNZsweImTbrZyQAAoBKq2f+BnUpK5C7zaGT+bJGqVm2gPxUAAFQGgSJ2SiZI3GD/lHQ6vd7+CQAAKoFAETslExxenxaZb/`
    }
    let url = 'https://extension-service.evendor.app/api';
    if (account && account.token) url = account.repositoryServer;

    return new Promise((resolve, reject) => {       
        axios.post(`${url}/generate_pdf`, {
            project: report.project.projectKey,
            module: report.module.name,
            environment: report.environment.name,
            title: report.title,
            actualResult: report.actualResults,
            description: report.description,
            stepsToReproduce: report.stepsToReproduce,
            expectedResult: report.expectedResult,
            xpath: report.xpath,
            screenshot: report.screenshot,
            url: window.location.href
        }).then(function (response) {
            resolve(response.data.result)
        }).catch(function (error) {
            console.log(error.reponse);
            if (error.response) {
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
    getPdf
}