const auth = (regData) => {
    return new Promise((resolve, reject) => {       
        fetch(`https://extension-auth.evendor.app/api/get_config?RegistrationKey=${regData.regKey}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 401) {
                    reject('Unauthorized')
                } else {
                    reject('Sorry, something went wrong')
                }
            })
            .then( data => {
                resolve(data)
            })
            .catch(error => {
                reject('Sorry, something went wrong');
            })       
    })
}
/* const auth = (regData) => {
    return new Promise((resolve, reject) => {       
        fetch(`https://extension-auth.evendor.app/api/get_config?RegistrationKey=${regData.regKey};email=${regData.email};appId=${regData.appId}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 401) {
                    reject('Unauthorized')
                } else {
                    reject('Sorry, something went wrong')
                }
            })
            .then( data => {
                resolve(data)
            })
            .catch(error => {
                reject('Sorry, something went wrong');
            })       
    })
} */

export default {
    auth
}