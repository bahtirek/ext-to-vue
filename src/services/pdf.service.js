import axios from 'axios';

const getPdf = (report, account) => {
    let url = 'https://extension-service.evendor.app/api';
    if (account && account.token) url = account.repositoryServer;

    return new Promise((resolve, reject) => {       
        axios.post(`${url}/generate_pdf`, {
            project: report.project.projectKey,
            module: report.module.name,
            environment: report.environment.name,
            title: report.title,
            actualResult: report.actualResult,
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