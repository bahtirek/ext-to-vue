const postProject = (data) => {
    let saveToJira = 0;
    if (data.saveToJira) saveToJira = 1;

    /* const body = {
        "registrationKey": data.registrationKey, 
        "token": data.token,
        "saveToJira": saveToJira,
        "projectKey": data.projectKey,
        "jiraId": data.jiraId
    }; */
    const body = JSON.stringify({
        "registrationKey": data.registrationKey, 
        "token": data.token,
        "saveToJira": saveToJira,
        "projectKey": data.projectKey,
        "jiraId": data.jiraId
    });

    console.log(body);

    return new Promise((resolve, reject) => {       
        fetch(`https://extension-service.evendor.app/api/project`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            mode: 'no-cors',
            body: body
        })
        .then(response => {
            if (response.ok) {
                console.log(response);
                return response.json();
            } else if (response.status === 401) {
                reject('Authoriation problem')
            } else {
                console.log(response);
                reject(response)
            }
        })
        .then( data => {
            console.log(data);
            resolve(data)
        })
        .catch(error => {
            console.log(error);
            reject(error);
        })       
    })
}
const getProjects = (account) => {
    return new Promise((resolve, reject) => {       
        fetch(`https://extension-service.evendor.app/api/project?isAdmin=${account.isAdmin}&registrationKey=${account.registrationKey}&token=${account.token}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 401) {
                    reject('Authoriation problem')
                } else {
                    reject(response)
                }
            })
            .then( data => {
                resolve(data)
            })
            .catch(error => {
                reject(error);
            })       
    })
}

export default {
    postProject,
    getProjects
}